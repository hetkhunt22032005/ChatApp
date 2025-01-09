"USE SCRIPT";
import express from "express";
import dotenv from "dotenv";
import { QueueManager, RedisManager, WorkerManager } from "./managers/index"; // .js
import { connectDB } from "./config/db"; // .js
("END");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/pending-messages/:roomId", async (req, res) => {
  const roomId = req.params["roomId"];
  const messages = await WorkerManager.getInstance().getPendingMessages(roomId);
  res.status(200).json({ pendingMessages: messages });
});

app.listen(PORT, async () => {
  await RedisManager.getInstance().connectRedis();
  await connectDB();
  QueueManager.getInstance().start();
});
