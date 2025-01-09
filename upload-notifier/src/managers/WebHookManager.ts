"USE SCRIPT";
import { Request, Response } from "express";
import {
  IMAGENOTIFICATION,
  IMAGENOTIFICATIONCHANNEL,
} from "../schema/data.schema"; // .js
import { PubSubManager } from "./PubSubManager"; // .js
("END");
class WebHookManager {
  private static instance: WebHookManager;

  public static getInstance(): WebHookManager {
    if (!this.instance) {
      this.instance = new WebHookManager();
    }
    return this.instance;
  }

  public async imageWehookHandler(req: Request, res: Response) {
    try {
      // Fetching the necessary data
      const {
        secure_url,
        asset_folder,
        context: {
          custom: { tempId, room },
        },
      } = req.body;

      // Input validation
      if (
        !secure_url ||
        asset_folder === "" ||
        !asset_folder.includes("/") ||
        !tempId ||
        !room
      ) {
        res.status(400).json({ message: "Invalid data provided" });
        return;
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
      try {
        // Publish it to "image-notification" channel
        await PubSubManager.getInstance().publish(
          IMAGENOTIFICATIONCHANNEL,
          JSON.stringify(message)
        );
        // return
        res
          .status(200)
          .json({ message: "Image notification published successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Failed to publish image notification" });
      }
    } catch (error: any) {
      console.log("Error in parsing data: ", error.message);
      res.status(400).json({ message: "Invalid data provided" });
      return;
    }
  }
}

export default WebHookManager;
