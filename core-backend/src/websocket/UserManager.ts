"USE SCRIPT";
import { Request } from "express";
import { User } from "./User"; // .js
import { AuthManager } from "./AuthManager"; // .js
import WebSocket from "ws";
import { RoomManager } from "./RoomManager";
("END");

export class UserManager {
  private static instance: UserManager;
  private users: Map<string, User>;

  private constructor() {
    this.users = new Map();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new UserManager();
    }
    return this.instance;
  }

  public addUser(ws: WebSocket, req: Request) {
    const userId = AuthManager.getInstance().validateUser(ws, req);
    if (!userId) {
      return;
    }
    const user = new User(userId, ws);
    this.users.set(userId, user);
    this.registerOnClose(ws, userId);
    console.log("Client connected: ", userId);
    return user;
  }

  private registerOnClose(ws: WebSocket, userId: string) {
    ws.on("close", () => {
      this.users.delete(userId);
      RoomManager.getInstance().userLeft(userId);
    });
  }

  public getUser(id: string) {
    return this.users.get(id);
  }
}
