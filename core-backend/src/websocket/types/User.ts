"USE SCRIPT";
import WebSocket from "ws";
import {
  ERRORMESSAGE,
  UserMessage,
  SENDMESSAGE,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "./index"; // .js
import { RoomManager } from "../managers/RoomManager"; // .js
("END");

export class User {
  private userId: string;
  private ws: WebSocket;

  constructor(userId: string, ws: WebSocket) {
    this.userId = userId;
    this.ws = ws;
    this.addListener();
  }

  public emit(message: string) {
    this.ws.send(JSON.stringify(message));
  }

  private addListener() {
    this.ws.on("message", (message: string) => {
      // Safe parsing the message
      let parsedMessage: UserMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error: any) {
        console.log("Error in parsing incoming message: ", error.message);
        this.emit(
          JSON.stringify({
            method: ERRORMESSAGE,
            message: "Invalid format of message",
          })
        );
        return;
      }
      // Check for the same user.
      if (parsedMessage.senderId !== this.userId) {
        this.emit(
          JSON.stringify({ method: ERRORMESSAGE, message: "Malicious user" })
        );
        return;
      }
      console.log(parsedMessage);
      // Handling different types of methods/events.
      switch (parsedMessage.method) {
        case SUBSCRIBE:
          parsedMessage.rooms.forEach((room) =>
            RoomManager.getInstance().subscribe(room, this.userId)
          );
          break;
        case SENDMESSAGE:
          RoomManager.getInstance().publish(
            parsedMessage.room,
            parsedMessage.senderId,
            parsedMessage
          );
          break;
        case UNSUBSCRIBE:
          break;
        default:
          this.emit(
            JSON.stringify({ method: ERRORMESSAGE, message: "Invalid method" })
          );
          break;
      }
    });
  }
}
