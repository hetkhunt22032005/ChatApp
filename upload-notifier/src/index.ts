"USE SCRIPT";
import express from "express";
import authenticateWebhook from "./middlewares/auth.middleware"; // .js
import WebHookManager from "./managers/WebHookManager"; // .js
import { PubSubManager } from "./managers/PubSubManager"; // .js
import dotenv from "dotenv";
("END");
// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Create the express server
const app = express();

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
  res.status(200).json({ message: "ChatApp - Upload Notifier" });
});

// Start the server
app.listen(PORT, async () => {
  await PubSubManager.getInstance().connectRedis();
  console.log(`Server is running on port ${PORT}.`);
});
