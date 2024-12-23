"USE SCRIPT";
import { Request } from "express";
import cookie from "cookie";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import WebSocket from "ws";
import {
  decodeRoomToken,
  decryptRoomToken,
  verifyRoomToken,
} from "../config/utils"; // .js
("END");

dotenv.config();

export class AuthManager {
  private static instance: AuthManager;
  private roomParticipants: Map<String, String[]>;

  private constructor() {
    this.roomParticipants = new Map();
  }

  public static getInstance(): AuthManager {
    if (!this.instance) {
      this.instance = new AuthManager();
    }
    return this.instance;
  }

  public validateUser(ws: WebSocket, req: Request) {
    const header = req.headers.cookie;
    if (!header) {
      ws.send("Unauthorised: No cookie provided");
      ws.close();
      return undefined;
    }
    const cookies = cookie.parse(header);
    const token = cookies["jwt"];
    if (!token) {
      ws.send("Unauthorised: No token provided");
      ws.close();
      return undefined;
    }

    const id = this.validateToken(ws, token);
    return id;
  }

  private validateToken(ws: WebSocket, token: string) {
    const secret = process.env.JWT_SECRET || "JWT_SECRET";
    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload & {
        id: string;
      };
      return payload.id;
    } catch (error: any) {
      if (error instanceof jwt.JsonWebTokenError) {
        ws.send("Unauthorised: Invalid token");
      } else if (error instanceof jwt.TokenExpiredError) {
        ws.send("Unauthorised: Token expired");
      } else {
        console.log("Error in AuthManager-validateToken: ", error.message);
        ws.send("Internal Server Error");
      }
      ws.close();
      return undefined;
    }
  }

  public validateRoom(room: string, senderId: string) {
    const decodedRoomToken = decodeRoomToken(room);
    if (!decodedRoomToken) {
      console.log("Invalid room");
      return undefined;
    }
    const decryptedRoomToken = decryptRoomToken(decodedRoomToken);
    if (!decryptedRoomToken) {
      console.log("Encrypted room token breached");
      return undefined;
    }
    const payload = verifyRoomToken(decryptedRoomToken);
    if (!payload.participants.includes(senderId)) {
      console.log("Sender not part of the room");
      return undefined;
    }
    if(!this.roomParticipants.has(room)) {
      this.roomParticipants.set(room, payload.participants);
    }
    console.log(this.roomParticipants);
    return payload.roomId;
  }

  public isUserPartOfRoom(room: string, senderId: string) {
    this.roomParticipants.get(room)?.includes(senderId);
  }
}
