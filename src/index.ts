import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { log } from "console";
import connectDB from "./config/db"; // .js
import { V1Router } from "./routes/index.route"; // .js

const app = express();
dotenv.config();

const Port = process.env.PORT || 3000;
const Mongo_Uri = process.env.MONGO_URI || "mongodb://localhost:27017";

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", V1Router);

app.listen(Port, async () => {
  await connectDB(Mongo_Uri);
  log(`Server is running on port ${Port}.`);
});
