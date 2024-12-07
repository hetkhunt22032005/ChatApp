import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";

export const wrapError = (error: ZodError) => {
  const detailedErrors = error.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));

  return detailedErrors;
};

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  } catch (error: any) {
    console.error("Error in hasing password: ", error.message);
    throw error;
  }
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error: any) {
    console.error("Error in comparing password: ", error.message);
    throw error;
  }
};

export const generateTokenAndSetCookie = (id: string, res: Response) => {
  try {
    const secret = process.env.JWT_SECRET || "JWT SECRET";
    const token = jwt.sign({ id }, secret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // Prevent XSS
      sameSite: "strict", // Prevent CSRF
      secure: process.env.NODE_ENV !== "development",
    });
  } catch (error: any) {
    console.error("Error in setting cookie: ", error.message);
    throw error;
  }
};

export const generateProfiePic = (
  gender: "male" | "female",
  username: string
) => {
  const field = gender === "male" ? "boy" : "girl";
  const url = `${process.env.AVATAR_BASE_URL}/public/${field}?username=${username}`;
  return url;
};
