import express from "express";
import dotenv from "dotenv";
import { RedisManager } from "./managers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await RedisManager.getInstance().connectRedis();
  setInterval(async () => {
    const queues = await RedisManager.getInstance().getQueues();
    console.log(queues);
    queues.forEach(async (queue) => {
      console.log(queue);
      const messages = await RedisManager.getInstance().getMessages(queue);
      console.log(messages);
      RedisManager.getInstance().clearMessages(queue, messages.length);
    });
  }, 5000);
});
