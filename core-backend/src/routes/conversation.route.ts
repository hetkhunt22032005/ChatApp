"USE SCRIPT";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware"; // .js
import {
  getContactList,
  getConversation,
  newConversation,
} from "../controllers/conversation.controller"; // .js
("END");

const conversationRouter = Router();

conversationRouter.post("/newConversation/:id", protectRoute, newConversation);

conversationRouter.get("/contacts", protectRoute, getContactList);

conversationRouter.get("/:id", protectRoute, getConversation);

export default conversationRouter;
