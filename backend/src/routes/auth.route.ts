"USE SCRIPT";
import { Router } from "express";
import {
  login,
  logout,
  signup,
  me,
} from "../controllers/auth.controller"; // .js
import { protectRoute } from "../middlewares/auth.middleware"; // .js
("END");
const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.get("/me", protectRoute, me);

export default authRouter;
