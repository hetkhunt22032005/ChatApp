"USE SCRIPT";
import { PROCESSEDMESSAGE, SendMessage } from "../types/index"; // .js
("END");
export class MessageManager {
  public static instance: MessageManager;

  constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MessageManager();
    }
    return this.instance;
  }

  public processMessage(message: SendMessage) {
    const {
      content: { text, image },
    } = message;
    if (!text && !image) return undefined;
    message.method = PROCESSEDMESSAGE;
    return message;
  }
}
