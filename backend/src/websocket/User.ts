"USE SCRIPT";
import WebSocket from "ws";
import {
  ERRORMESSAGE,
  ErrorMessage,
  Message,
  SendMessage,
  SENDMESSAGE,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "./types"; // .js
import { RoomManager } from "./RoomManager"; // .js
("END");

export class User {
  private userId: string;
  private ws: WebSocket;

  constructor(userId: string, ws: WebSocket) {
    this.userId = userId;
    this.ws = ws;
    this.addListener();
  }

  public emit(message: SendMessage | ErrorMessage) {
    this.ws.send(JSON.stringify(message));
  }

  private addListener() {
    this.ws.on("message", (message: string) => {
      // Safe parsing the message
      let parsedMessage: Message;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error: any) {
        console.log("Error in parsing incoming message: ", error.message);
        this.emit({
          method: ERRORMESSAGE,
          message: "Invalid format of message",
        });
        return;
      }
      // Check for the same user.
      if (parsedMessage.senderId !== this.userId) {
        this.emit({ method: ERRORMESSAGE, message: "Malicious user" });
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
          break;
        case UNSUBSCRIBE:
          break;
        default:
          this.emit({ method: ERRORMESSAGE, message: "Invalid method" });
          break;
      }
    });
  }
}
