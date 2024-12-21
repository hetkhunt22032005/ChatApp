"USE SCRIPT";
import WebSocket from "ws";
import { Message, SENDMESSAGE, SUBSCRIBE, UNSUBSCRIBE } from "./types";
("END");

export class User {
  private id: string;
  private ws: WebSocket;

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
    this.addListener();
  }

  public emit(message: string) {
    this.ws.send(JSON.stringify(message));
  }

  private addListener() {
    this.ws.on("message", (message: string) => {
      let parsedMessage: Message;
      try {
        parsedMessage = JSON.parse(message);
      } catch (error: any) {
        console.log("Error in parsing incoming message: ", error.message);
        this.emit("Invalid format of message");
        return;
      }
      // Check for the same user.
      if (parsedMessage.senderId !== this.id) {
        this.emit("Malicious user");
        return;
      }
      // Handling different types of messages.
      switch (parsedMessage.method) {
        case SUBSCRIBE:
          break;
        case SENDMESSAGE:
          break;
        case UNSUBSCRIBE:
          break;
        default:
          this.emit("Invalid method");
          break;
      }
    });
  }
}
