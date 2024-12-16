"USE SCRIPT";
import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware"; // .js
import { getUsers, updateProfile } from "../controllers/user.controller"; // .js
("END");
const userRouter = Router();

userRouter.put("/update-profile", protectRoute, updateProfile);

userRouter.get("/search-users", protectRoute, getUsers);

export default userRouter;
