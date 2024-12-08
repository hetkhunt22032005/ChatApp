import { Router } from "express";
import { login, logout, signup, updateProfile, me } from "../controllers/auth.controller"; // .js
import { protectRoute } from "../middlewares/auth.middleware"; // .js

const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.post("/logout", logout);

authRouter.put("/update-profile", protectRoute, updateProfile);

authRouter.get("/me", protectRoute, me);

export default authRouter;
