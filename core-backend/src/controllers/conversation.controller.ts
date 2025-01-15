"USE SCRIPT";
import { Request, Response } from "express";
import {
  encodeRoomToken,
  encryptRoomToken,
  generateRoomId,
  generateRoomToken,
  ObjectId,
} from "../config/utils"; // .js
import Conversation from "../models/conversation.model"; // .js
import User from "../models/user.model"; // .js
("END");

export const newConversation = async (req: Request, res: Response) => {
  try {
    // Fetch the necessary fields
    const senderId = ObjectId.convert(res.locals.user._id);
    const receiver = req.params["id"];
    // check for input validation
    const receiverId = ObjectId.isValid(receiver)
      ? ObjectId.convert(receiver)
      : undefined;
    if (!receiverId) {
      res.status(400).json({ message: "Invalid receiver ID." });
      return;
    }
    // Check for existing conversation and receiver
    const [existingConversation, existingReceiver] = await Promise.all([
      Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      }),
      User.findOne({ _id: receiverId }),
    ]);

    if (!existingReceiver) {
      res.status(400).json({ message: "Invalid receiver." });
      return;
    }

    if (existingConversation) {
      res.status(400).json({ message: "Conversation already exists." });
      return;
    }
    // Get a room id
    const roomId = generateRoomId();
    // Generate the room token
    const roomToken = generateRoomToken(roomId, [
      senderId.toString(),
      receiverId.toString(),
    ]);
    // Encrypt the room token
    const encryptedRoomToken = encryptRoomToken(roomToken);
    // Encode the room token
    const securedRoomToken = encodeRoomToken(encryptedRoomToken);
    // create the conversation
    const conversation = new Conversation({
      roomId,
      creator: senderId,
      room: securedRoomToken,
      participants: [senderId, receiverId],
    });

    await conversation.save();

    res.status(200).json({
      message: "Conversation created successfully.",
      _id: conversation._id,
      creator: conversation.creator,
      room: conversation.room,
    });
  } catch (error: any) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO: Pagination
export const getContactList = async (req: Request, res: Response) => {
  try {
    // Fetch the senderId
    const userId = ObjectId.convert(res.locals.user._id);
    // Fetch all conversations in which userId is present in participants
    const contacts = await Conversation.find({
      participants: { $in: [userId] },
    })
      .select("-roomId")
      .sort({ updatedAt: -1 })
      .populate({
        path: "participants",
        match: { _id: { $ne: userId } },
        select: "fullname username profilePic",
      });
    // .populate({
    //   path: "latestMessage",
    // });
    // Filtering to show empty conversation only to the creator as their contact and not to show the other member
    // This is similar to just people in contact but with whom they not yet chatted
    contacts.filter(
      (contact) => contact.creator.equals(userId) || contact.lastMessage
    );
    // return
    res.status(200).json({ contacts });
  } catch (error: any) {
    console.log("Error in getContactList controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getConversation = async (req: Request, res: Response) => {
  try {
    const userId = ObjectId.convert(res.locals.user._id);
    // Fetch the conversationId
    const id = req.params["id"];
    const conversationId = ObjectId.isValid(id)
      ? ObjectId.convert(id)
      : undefined;
    if (!conversationId) {
      res.status(400).json({ message: "Invalid conversation ID." });
      return;
    }
    // Fetch the conversation using conversationId
    const conversation = await Conversation.findById(conversationId)
      .select("-roomId")
      .populate({
        path: "participants",
        select: "fullname username profilePic",
      });
    // Validation of membership
    if (
      !conversation ||
      !conversation.participants.some((participant) =>
        participant._id.equals(userId)
      )
    ) {
      res.status(403).json({
        message: "Forbidden. You are not a member of this conversation.",
      });
      return;
    }
    // Filter the conversation
    conversation.participants = conversation.participants.filter(
      (participant) => !participant._id.equals(userId)
    );
    // return
    res.status(200).json({ conversation });
  } catch (error: any) {
    console.log("Error in getConversation controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
