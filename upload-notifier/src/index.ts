import express from "express";
import authenticateWebhook from "./middlewares/auth.middleware";
import { WebHookManager } from "./managers/WebHookManager";
import { PubSubManager } from "./managers/PubSubManager";
import dotenv from "dotenv";

// Create the express server
const app = express();

// Load environment variables
dotenv.config();

// Body parser
app.use(express.json());

// Webhook handlers
app.post(
  "/wh/image/:whsecret",
  authenticateWebhook,
  WebHookManager.getInstance().imageWehookHandler
);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({message: "ChatApp - Upload Notifier"});
});

// Start the server
app.listen(3000, async () => {
  await PubSubManager.getInstance().connectRedis();
  console.log("Server is running on port 3000.");
});
