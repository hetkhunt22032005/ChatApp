"USE SCRIPT";
import { Request, Response } from "express";
import Conversation from "../models/conversation.model"; // .js
import { ObjectId } from "../config/utils"; // .js
import Message from "../models/message.model"; // .js
("END");

//TODO: Pagination using the timestamp
export const getMessages = async (req: Request, res: Response) => {
  try {
    // fetch the userId and userId
    const conversation = req.params["id"];
    const conversationId = ObjectId.isValid(conversation)
      ? ObjectId.convert(conversation)
      : undefined;
    if (!conversationId) {
      res.status(400).json({ message: "Invalid conversation ID." });
      return;
    }
    const userId = ObjectId.convert(res.locals.user._id);
    // fetch the conversation using conversationId
    const conversationDoc = await Conversation.findById(conversationId);
    // Validation of membership
    if (!conversationDoc || !conversationDoc.participants.includes(userId)) {
      res.status(403).json({
        message: "Forbidden. You are not a member of this conversation.",
      });
      return;
    }
    // Query the messages
    const messages = await Message.find({
      conversationId: conversationId,
    }).sort({ createdAt: -1 });
    // return
    res.status(200).json({ messages });
  } catch (error: any) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
