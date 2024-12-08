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
import cloudinary from "../config/cloudinary"; // .js

export const signup = async (req: Request, res: Response) => {
  try {
    // Input Validation
    const response1 = SignUpSchemaL1.parse(req.body);
    const response2 = SignUpSchemaL2.parse(response1);
    // Unique Email
    const isEmailExist = await User.findOne({ email: response2.email });
    if (isEmailExist) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }
    // Unique Username
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
    generateTokenAndSetCookie(String(user._id), res);
    // return
    res.status(201).json({
      message: "Account created successfully.",
      _id: user._id,
      fullName: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
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
    generateTokenAndSetCookie(String(user._id), res);
    // return
    res.status(200).json({
      message: "Logged in successfully.",
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // Input Validation
    const { profilePic } = req.body;
    const id = res.locals.user._id;
    if (!profilePic) {
      res.status(400).json({ message: "Profile pic is required." });
      return;
    }
    // Upload to cloudinary server
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // Update the database entry
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");
    // return
    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.log("Error in updateProfile Controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const me = (req: Request, res: Response) => {
  try {
    // fetch the user from res
    const user = res.locals.user;
    // return
    res.status(200).json(user);
  } catch (error: any) {
    console.log('Error in me controller: ', error.message);
  }
}
