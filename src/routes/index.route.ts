"USE SCRIPT"
import { Router } from "express";
import authRouter from "./auth.route"; // .js
import messageRouter from "./message.route"; // .js
"END"
export const V1Router = Router();

V1Router.use("/auth", authRouter);

V1Router.use("/message", messageRouter);
