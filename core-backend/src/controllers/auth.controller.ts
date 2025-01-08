"USE SCRIPT";
import { Request, Response } from "express";
import {
  LoginSchema,
  SignUpSchemaL1,
  SignUpSchemaL2,
} from "../config/data.schema"; // .js
import { ZodError } from "zod";
import {
  comparePasswords,
  generateProfiePic,
  generateTokenAndSetCookie,
  hashPassword,
  wrapError,
} from "../config/utils"; // .js
import User from "../models/user.model"; // .js
("END");
export const signup = async (req: Request, res: Response) => {
  try {
    // Input Validation
    const response1 = SignUpSchemaL1.parse(req.body);
    const response2 = SignUpSchemaL2.parse(response1);
    // Unique username
    const isUsernameExist = await User.findOne({
      username: response2.username,
    });
    if (isUsernameExist) {
      res.status(400).json({ message: "Username already exists." });
      return;
    }
    // Password hashing
    const hashedPassword = await hashPassword(response2.password);
    // Profile picture
    const profilePic = generateProfiePic(response2.gender, response2.username);
    // Create db entry
    const user = await User.create({
      ...response2,
      password: hashedPassword,
      profilePic,
    });
    // Generate token and set cookie
    const token = generateTokenAndSetCookie(String(user._id), res);
    // return
    res.status(201).json({
      message: "Account created successfully.",
      user: {
        _id: user._id,
        fullName: user.fullname,
        username: user.username,
        profilePic: user.profilePic,
      },
      token,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const detailedErrors = wrapError(error);
      res.status(400).json({
        message: "Invalid input fields.",
        errors: detailedErrors,
      });
    } else {
      console.error("Error in signup: ", error.message);
      res.status(500).json({ message: "Internal Server Error." });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // basic input check
    const response = LoginSchema.parse(req.body);
    // finding user in db
    const user = await User.findOne({ username: response.username });
    if (!user) {
      res.status(401).json({ message: "Incorrect username or password." });
      return;
    }
    // password matching
    const matched = await comparePasswords(response.password, user.password);
    if (!matched) {
      res.status(401).json({ message: "Incorrect username or passowrd." });
      return;
    }
    // generate token and set cookie
    const token = generateTokenAndSetCookie(String(user._id), res);
    // return
    res.status(200).json({
      message: "Logged in successfully.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        profilePic: user.profilePic,
      },
      token,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const detailedErrors = wrapError(error);
      res.status(400).json({
        message: "Invalid input fields.",
        errors: detailedErrors,
      });
    } else {
      console.error("Error in Login: ", error.message);
      res.status(500).json({ message: "Internal Server Error." });
    }
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    // clear the cookie
    res.clearCookie("jwt");
    // return
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error: any) {
    console.error("Error in logout: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const me = (req: Request, res: Response) => {
  try {
    // fetch the user from res
    const user = res.locals.user;
    const token = res.locals.token;
    // return
    res.status(200).json({ token, user });
  } catch (error: any) {
    console.log("Error in me controller: ", error.message);
  }
};
