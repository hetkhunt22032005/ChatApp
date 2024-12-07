import { Router } from "express";
import authRouter from "./auth.route.ts";

export const V1Router = Router();

V1Router.use('/auth', authRouter);
