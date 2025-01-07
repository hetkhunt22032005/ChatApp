"USE SCRIPT";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // .js
("END");
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookie
    const token = req.cookies.jwt;
    // Check presence of token
    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided." });
      return;
    }
    // Verify token
    const secret = process.env.JWT_SECRET || "JWT SECRET";
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload & {
      id: string;
    };
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid token." });
      return;
    }
    // Fetch user details from db
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    // Attach user to request object
    res.locals.user = user;
    res.locals.token = token;
    // Next
    next();
  } catch (error: any) {
    console.log("Error in protectRoute Middleware: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
