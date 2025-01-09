"USE SCRIPT";
import { parentPort } from "worker_threads";
import { connectDB, closeDB } from "../config/db"; // .js
import {
  CHATMESSAGE,
  IMAGENOTIFICATION,
  UserMessage,
  ParentMessages,
  PROCESS,
  PROCESSED,
  TERMINATE,
  TERMINATED,
} from "./index"; // .js
import Message from "../models/message.model"; // .js
import Conversation from "../models/conversation.model"; // .js
("END");
let DBStatus = "disconnected";

async function processMessage(messages: string[], queue: string) {
  // Ensuring database connection
  if (DBStatus === "disconnected") {
    await connectDB();
    DBStatus = "connected";
  }
  // Fetching roomId from queue
  const roomId = queue.split("queue-")[1];
  // Parsing the messages
  const parsedMessages = messages.map(
    (message) => JSON.parse(message) as UserMessage
  );
  // Filtering chat and image notifications
  const chatMessages = [];
  const imageNotifications = [];

  for (const message of parsedMessages) {
    if (message.method === CHATMESSAGE) {
      chatMessages.push(message);
    } else if (message.method === IMAGENOTIFICATION) {
      imageNotifications.push(message);
    }
  }

  if (chatMessages.length > 0) {
    // Storing the chats and updating the last message in conversation

    const messageDocuments = chatMessages.map((chatMessage) => {
      return {
        senderId: chatMessage.senderId,
        roomId: roomId,
        conversationId: chatMessage.conversationId,
        tempId: chatMessage.tempId,
        text: chatMessage.content.text,
        image: chatMessage.content.image,
        createdAt: chatMessage.createdAt,
      };
    });
    // Fetching the conversationId
    const conversationId = messageDocuments[0].conversationId;
    // Inserting the messages in bulk
    const insertResponse = await Message.insertMany(messageDocuments);
    // Updating the last message in the conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: insertResponse[0]._id,
    });
  }
  if (imageNotifications.length > 0) {
    // Updating the image url in chat
    for (let imageNotification of imageNotifications) {
      await Message.updateOne(
        { tempId: imageNotification.tempId },
        { image: imageNotification.image_url }
      );
    }
  }

  // return
  parentPort?.postMessage({
    method: PROCESSED,
    batchSize: messages.length,
    queue: queue,
  });
}

async function terminate() {
  // Close the connection
  if (DBStatus === "connected") {
    await closeDB();
    DBStatus = "disconnected";
  }
  parentPort?.postMessage({ method: TERMINATED });
}

parentPort?.on("message", async (message: ParentMessages) => {
  // Handling different cases
  switch (message.method) {
    case PROCESS:
      processMessage(message.messages, message.queue);
      break;
    case TERMINATE:
      terminate();
      break;
  }
});
