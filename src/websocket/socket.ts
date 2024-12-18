import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

export const app = express();

export const httpServer = http.createServer(app);

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws, req) => {
  console.log(req.headers.cookie);
  console.log("Client connected");
});
