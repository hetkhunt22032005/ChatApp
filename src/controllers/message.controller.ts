"USE SCRIPT";
import { Request, Response } from "express";
import Conversation from "../models/conversation.model"; // .js
import cloudinary from "../config/cloudinary"; // .js
import Message from "../models/message.model"; // .js
("END");
// TODO: Microservice architecture for image upload.
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
    const conversation = await Conversation.findOneAndUpdate(
      { participants: { $size: 2, $all: [senderId, receiverId] } },
      { $setOnInsert: { participants: [senderId, receiverId] } },
      { new: true, upsert: true }
    );
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
      newMessage: {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        text: newMessage.text,
        image: newMessage.image,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//TODO: Pagination remaining
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
        select: "fullname profilePic",
      });
    // return
    res.status(200).json(contacts);
  } catch (error: any) {
    console.log("Error in getContactList controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
