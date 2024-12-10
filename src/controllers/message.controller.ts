"USE SCRIPT"
import { Request, Response } from "express";
import Conversation from "../models/conversation.model"; // .js
import cloudinary from "../config/cloudinary"; // .js
import Message from "../models/message.model"; // .js
"END"
export const sendMessage = async (req: Request, res: Response) => {
  try {
    // fetch the necessary fields
    const { text, image } = req.body;
    const senderId = res.locals.user._id;
    const receiverId = req.params["id"];
    // check for input validation
    if (!text && !image) {
      res.status(400).json({ message: "Cannot send empty message." });
      return;
    }
    // create or fetch the conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    // Create a new message
    let imageUrl;
    // If image is provided, upload it to cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    // Add the message to the conversation
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Broadcast the message to the receiver

    // return
    res.status(200).json({
      message: "Message sent successfully.",
      newMessage,
    });
  } catch (error: any) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    // fetch the userId and receiverId
    const receiverId = req.params["id"];
    const senderId = res.locals.user._id;
    // fetch the conversation using this two fields and populate input
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })
      .populate("messages")
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

export const getContactList = async (req: Request, res: Response) => {
  try {
    // fetch the senderId
    const senderId = res.locals.user._id;
    // fetch all conversations in which senderId is present in participants
    const contacts = await Conversation.find({
      participants: { $in: [senderId] },
    })
      .select("participants")
      .populate({
        path: "participants",
        match: { _id: { $ne: senderId } },
        select: "fullname profilePic",
      });
    // return
    res.status(200).json(contacts);
  } catch (error: any) {
    console.log("Error in getContactList controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

