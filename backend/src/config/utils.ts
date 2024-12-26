import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

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

export const generateRoomId = () => {
  return uuidv4();
};

export const generateRoomToken = (roomId: string, participants: string[]) => {
  const secret = process.env.ROOM_SECRET || "ROOM_SECRET";
  const roomToken = jwt.sign({ roomId, participants }, secret);
  return roomToken;
};

export const verifyRoomToken = (roomToken: string) => {
  try {
    const secret = process.env.ROOM_SECRET || "ROOM_SECRET";
    const payload = jwt.verify(roomToken, secret) as jwt.JwtPayload & {
      roomId: string;
      participants: string[];
    };
    return { roomId: payload.roomId, participants: payload.participants };
  } catch (error: any) {
    console.log("Error in verifyRoomToken utility: ", error.message);
    throw error;
  }
};

export const encryptRoomToken = (roomToken: string) => {
  try {
    const key = process.env.ENCRYPTION_KEY || "ENCRYPTION_KEY";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key), iv);
    let encrypted = cipher.update(roomToken, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${encrypted}.${iv.toString("hex")}.${authTag}`;
  } catch (error: any) {
    console.log("Error in encryptRoomToken utility: ", error.message);
    throw error;
  }
};

export const decryptRoomToken = (encryptedRoomToken: string) => {
  try {
    const [encrypted, iv, authTag] = encryptedRoomToken.split(".");
    const key = process.env.ENCRYPTION_KEY || "ENCRYPTION_KEY";
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(key),
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrpted = decipher.update(encrypted, "hex", "utf8");
    decrpted += decipher.final("utf8");
    return decrpted;
  } catch (error: any) {
    console.log("Error in decryptRoomToken utility: ", error.message);
    return undefined;
  }
};

export const encodeRoomToken = (encryptedRoomToken: string) => {
  try {
    return Buffer.from(encryptedRoomToken).toString("base64");
  } catch (error: any) {
    console.log("Error in encodeRoomToken utility: ", error.message);
    return undefined;
  }
};

export const decodeRoomToken = (encodedRoomToken: string) => {
  try {
    return Buffer.from(encodedRoomToken, "base64").toString("utf8");
  } catch (error: any) {
    console.log("Error in decodeRoomToken utility: ", error.message);
    return undefined;
  }
};
