"USE SCRIPT";
import express, { Request } from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { UserManager } from "./managers/index"; // .js
("END");

export const app = express();

export const httpServer = http.createServer(app);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws: WebSocket, req: Request) => {
  UserManager.getInstance().addUser(ws, req);
});
