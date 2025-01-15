"USE SCRIPT";
import { Router } from "express";
import { getMessages } from "../controllers/message.controller"; // .js
import { protectRoute } from "../middlewares/auth.middleware"; // .js
("END");

const messageRouter = Router();

messageRouter.get("/:id", protectRoute, getMessages);

export default messageRouter;
