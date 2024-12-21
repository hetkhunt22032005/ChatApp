"USE SCRIPT";
import { Request, Response } from "express";
import Conversation from "../models/conversation.model"; // .js
import cloudinary from "../config/cloudinary"; // .js
import Message from "../models/message.model"; // .js
import {
  encodeRoomToken,
  encryptRoomToken,
  generateRoomId,
  generateRoomToken,
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
      $expr: { $eq: [{ $size: "$participants" }, 2] },
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
      room: securedRoomToken,
      participants: [senderId, receiverId],
    });

    res.status(200).json({
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

//TODO: Shift the call to redis first and then to database
export const getMessages = async (req: Request, res: Response) => {
  try {
    // fetch the userId and receiverId
    const receiverId = req.params["id"];
    const senderId = res.locals.user._id;
    // fetch the conversation using this two fields and populate input
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "participants",
        match: { _id: { $ne: senderId } },
        select: "fullname profilePic username",
      });
    // return
    res.status(200).json(conversation);
  } catch (error: any) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO: Pagination remaining
export const getContactList = async (req: Request, res: Response) => {
  try {
    // fetch the senderId
    const senderId = res.locals.user._id;
    // fetch all conversations in which senderId is present in participants
    const contacts = await Conversation.find({
      participants: { $in: [senderId] },
    })
      .select("participants updatedAt")
      .sort({ updatedAt: -1 })
      .populate({
        path: "participants",
        match: { _id: { $ne: senderId } },
        select: "fullname username profilePic",
      });
    // return
    res.status(200).json(contacts);
  } catch (error: any) {
    console.log("Error in getContactList controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
