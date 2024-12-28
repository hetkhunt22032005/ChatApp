"USE SCRIPT";
import { Router } from "express";
import {
  getContactList,
  getMessages,
  newConversation,
} from "../controllers/message.controller"; // .js
import { protectRoute } from "../middlewares/auth.middleware"; // .js
("END");
const messageRouter = Router();

messageRouter.post("/newConversation/:id", protectRoute, newConversation);

messageRouter.get("/conversation/:id", protectRoute, getMessages);

messageRouter.get("/contacts", protectRoute, getContactList);

export default messageRouter;
