import { Hono } from "hono";
import { Bindings, Variables } from "@generics/hono.generic";
import {
  authenticateClient,
  authenticateWebhook,
} from "@middlewares/auth.middleware";
import { IMAGENOTIFICATION, MetaData } from "./schema/data.schema";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "redis";

const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

app.get("/", (c) => {
  return c.text("ChatApp CF Worker.");
});

app.post("/generate-signed-url", authenticateClient, async (c) => {
  try {
    // Fetch necessary data
    const { tempId, room } = (await c.req.json()) as MetaData;
    const senderId = c.get("senderId");
    // Input Validation
    if (!tempId || !room) {
      return c.json({ message: "Invalid metadata provided." }, 400);
    }
    // Create the timestamp (Valid for 2 minutes)
    const timestamp = Math.floor(Date.now() / 1000) - 58 * 60;
    // Metadata
    const context = `tempId=${tempId},room=${room}`;
    // Sign the url
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: `user_uploads/${senderId}`,
        context: context,
      },
      c.env.CLOUDINARY_API_SECRET
    );
    // return
    return c.json(
      {
        url: `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        signature,
        timestamp,
        api_key: c.env.CLOUDINARY_API_KEY,
        folder: `user_uploads/${senderId}`,
        context,
      },
      200
    );
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return c.json({ message: "Invalid JSON payload." }, 400);
    }
    console.log("Error in generating signed URL: " + error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
});

app.post("/wh/image/:whsecret", authenticateWebhook, async (c) => {
  // Fetching the necessary data
  const {
    secure_url,
    asset_folder,
    context: {
      custom: { tempId, room },
    },
  } = await c.req.json();
  // Input validation
  if (
    !secure_url ||
    asset_folder === "" ||
    !asset_folder.includes("/") ||
    !tempId ||
    !room
  ) {
    return c.json({ message: "Invalid data provided." }, 400);
  }
  // Fetching senderId
  const senderId = asset_folder.split("/")[1] as string;
  // Creating the message object
  const message = {
    method: IMAGENOTIFICATION,
    room,
    senderId,
    tempId,
    image_url: secure_url,
  };
  // Throw in queue
  try {
    // Creating the redis connection
    const client = createClient();
    await client.connect();
    // Pushing to the queue
    await client.lPush("user-uploads", JSON.stringify(message));
  } catch (error) {
    console.log('Error in redis connection: ', error);
    return c.json({message: "Failure"}, 500);
  }
  return c.json({message: "Success"}, 200);
});

export default app;
