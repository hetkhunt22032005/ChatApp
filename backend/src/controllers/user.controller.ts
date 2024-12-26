"USE SCRIPT";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinary"; // .js
import User from "../models/user.model"; // .js
import { updateSchema } from "../config/data.schema"; // .js
import { ZodError } from "zod";
import { wrapError } from "../config/utils"; // .js
("END");
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic, email, fullname } = req.body;
    const id = res.locals.user._id;
    // Input Validation
    if (!profilePic && !email && !fullname) {
      res.status(400).json({ message: "No update data provided." });
      return;
    }
    const {
      profilePic: validatedPic,
      email: validatedEmail,
      fullname: validatedFullname,
    } = updateSchema.parse({ profilePic, email, fullname });
    // Creating the update payload
    const uploadFields: Partial<{
      profilePic: string;
      fullname: string;
      email: string;
    }> = {};
    if (validatedPic) {
      // Upload to cloudinary server
      const uploadResponse = await cloudinary.uploader.upload(validatedPic);
      uploadFields.profilePic = uploadResponse.secure_url;
    }
    if (validatedEmail) {
      // Unique Email
      const existingUser = await User.findOne({ email: validatedEmail });
      if (existingUser && existingUser._id !== id) {
        res.status(400).json({ message: "Email already exists." });
        return;
      }
      uploadFields.email = validatedEmail;
    }
    if (validatedFullname) {
      uploadFields.fullname = validatedFullname;
    }
    // Update the database entry
    const updatedUser = await User.findByIdAndUpdate(id, uploadFields, {
      new: true,
    }).select("-password");
    // return
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const detailedErrors = wrapError(error);
      res.status(400).json({
        message: "Invalid input fields.",
        errors: detailedErrors,
      });
    } else {
      console.log("Error in updateProfile Controller: ", error.message);
      res.status(500).json({ message: "Internal Server Error." });
    }
  }
};
// TODO: Vector Search
export const getUsers = async (req: Request, res: Response) => {
  try {
    const senderId = res.locals.user._id;
    const userList = await User.find({ _id: { $ne: senderId } })
      .select("fullname username profilePic")
      .limit(15);
    res.status(200).json(userList);
  } catch (error: any) {
    console.log("Error in getUsers Controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
