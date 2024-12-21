"USE SCRIPT";
import { Request } from "express";
import { User } from "./User"; // .js
import { AuthManager } from "./AuthManager"; // .js
import WebSocket from "ws";
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
    const id = AuthManager.getInstance().validateUser(ws, req);
    if (!id) {
      return;
    }
    const user = new User(id, ws);
    this.users.set(id, user);
    this.registerOnClose(ws, id);
    console.log("Client connected: ", id);
    return user;
  }

  private registerOnClose(ws: WebSocket, id: string) {
    ws.on("close", () => {
      this.users.delete(id);
    });
  }

  public getUser(id: string) {
    return this.users.get(id);
  }
}
