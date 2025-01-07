"USE SCRIPT";
import { Request, Response } from "express";
import Conversation from "../models/conversation.model"; // .js
import {
  encodeRoomToken,
  encryptRoomToken,
  generateRoomId,
  generateRoomToken,
  ObjectId,
} from "../config/utils"; // .js
("END");

export const newConversation = async (req: Request, res: Response) => {
  try {
    // Fetch the necessary fields
    const senderId = res.locals.user._id;
    const receiverId = req.params["id"];
    // check for input validation
    if (!receiverId) {
      res.status(400).json({ message: "Invalid receiver ID." });
      return;
    }
    // Check for existing conversation
    const existingConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (existingConversation) {
      res.status(400).json({ message: "Conversation already exists." });
      return;
    }
    // Get a room id
    const roomId = generateRoomId();
    // Generate the room token
    const roomToken = generateRoomToken(roomId, [senderId, receiverId]);
    // Encrypt the room token
    const encryptedRoomToken = encryptRoomToken(roomToken);
    // Encode the room token
    const securedRoomToken = encodeRoomToken(encryptedRoomToken);
    // create the conversation
    const conversation = new Conversation({
      roomId,
      room: securedRoomToken,
      participants: [senderId, receiverId],
    });

    await conversation.save();

    res.status(200).json({
      conversationId: conversation._id,
      message: "Conversation created successfully.",
      senderId,
      receiverId,
      room: conversation.room,
    });
  } catch (error: any) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO: Pagination using the array length
export const getMessages = async (req: Request, res: Response) => {
  try {
    // fetch the userId and receiverId
    const conversation = req.params["id"];
    const conversationId = ObjectId.convert(conversation);
    const senderId = ObjectId.convert(res.locals.user._id);
    // fetch the conversation using conversationId
    const conversationDoc = await Conversation.findById(conversationId);
    // Validation of membership
    if (!conversationDoc || !conversationDoc.participants.includes(senderId)) {
      res.status(403).json({
        message: "Forbidden. You are not a member of this conversation.",
      });
      return;
    }
    // Populate the messages

    // return
    res.status(200).json(conversation);
  } catch (error: any) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO: Pagination
export const getContactList = async (req: Request, res: Response) => {
  try {
    // Fetch the senderId
    const senderId = ObjectId.convert(res.locals.user._id);
    // Fetch all conversations in which senderId is present in participants
    const contacts = await Conversation.find({
      participants: { $in: [senderId] },
    })
      .select("-messages -roomId")
      .sort({ updatedAt: -1 })
      .populate({
        path: "participants",
        match: { _id: { $ne: senderId } },
        select: "fullname username profilePic",
      })
      .populate({
        path: "latestMessage",
      });

    // return
    res.status(200).json(contacts);
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
      .select("-messages -lastMessage -roomId")
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
    res.status(200).json(conversation);
  } catch (error: any) {
    console.log("Error in getConversation controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
