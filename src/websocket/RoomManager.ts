"USE SCRIPT";
import { createClient, RedisClientType } from "redis";
import { AuthManager } from "./AuthManager"; // .js
import { UserManager } from "./UserManager"; // .js
import { ERRORMESSAGE, SendMessage } from "./types"; // .js
("END");

export class RoomManager {
  private static instance: RoomManager;
  private subscriptions: Map<string, string[]>;
  private reverseSubscriptions: Map<string, string[]>;
  private subscriberClient: RedisClientType;
  private publisherClient: RedisClientType;

  private constructor() {
    this.subscriptions = new Map();
    this.reverseSubscriptions = new Map();
    this.subscriberClient = createClient();
    this.publisherClient = createClient();
    try {
      this.subscriberClient.connect();
      this.publisherClient.connect();
    } catch (error) {
      console.log("COnnection error in redis client: ", error);
      process.exit(1);
    }
  }

  public static getInstance(): RoomManager {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public subscribe(room: string, id: string) {
    const roomId = AuthManager.getInstance().validateRoom(room, id);
    if (!roomId) {
      UserManager.getInstance().getUser(id)?.emit({
        method: ERRORMESSAGE,
        message: "Unauthorised: Invalid room or not authorised",
      });
      return;
    }
    if (this.subscriptions.get(id)?.includes(roomId)) {
      UserManager.getInstance()
        .getUser(id)
        ?.emit({ method: ERRORMESSAGE, message: "Already subscribed to room" });
      return;
    }
    this.subscriptions.set(
      id,
      (this.subscriptions.get(id) || []).concat(roomId)
    );
    this.reverseSubscriptions.set(
      roomId,
      (this.reverseSubscriptions.get(roomId) || []).concat(id)
    );

    if (this.reverseSubscriptions.get(roomId)?.length === 1) {
      this.subscriberClient.subscribe(roomId, this.redisCallbackHandler);
    }
  }

  private redisCallbackHandler(message: string, roomId: string) {
    const parsedMessage: SendMessage = JSON.parse(message);
    this.reverseSubscriptions.get(roomId)?.forEach((subscriber) => {
      if (parsedMessage.senderId !== subscriber) {
        UserManager.getInstance().getUser(subscriber)?.emit(parsedMessage);
      }
    });
  }
}
