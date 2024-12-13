"USE SCRIPT";
import { Router } from "express";
import {
  getContactList,
  getMessages,
  sendMessage,
} from "../controllers/message.controller"; // .js
import { protectRoute } from "../middlewares/auth.middleware"; // .js
("END");
const messageRouter = Router();

messageRouter.post("/send/:id", protectRoute, sendMessage);

messageRouter.get("/conversation/:id", protectRoute, getMessages);

messageRouter.get("/contacts", protectRoute, getContactList);

export default messageRouter;
