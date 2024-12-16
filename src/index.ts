"USE SCRIPT";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { log } from "console";
import cors from "cors";
import connectDB from "./config/db"; // .js
import { V1Router } from "./routes/index.route"; // .js
import { app, httpServer } from "./websocket/socket"; // .js
("END");

dotenv.config();

const Port = process.env.PORT || 3000;
const Mongo_Uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const Client_Url = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: Client_Url,
    credentials: true,
  })
);
app.use("/api/v1", V1Router);

httpServer.listen(Port, async () => {
  await connectDB(Mongo_Uri);
  log(`Server is running on port ${Port}.`);
});
