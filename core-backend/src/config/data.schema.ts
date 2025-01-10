import { z } from "zod";

// Level 1 for reqirements of field.
export const SignUpSchemaL1 = z.object({
  fullname: z
    .string()
    .trim()
    .min(6, { message: "Full name must be atleast 6 characters long." })
    .max(255, { message: "Full name cannot be more than 255 characters." }),

  password: z
    .string()
    .trim()
    .min(8, { message: "Passworrd must be atleast 8 characters long." })
    .max(20, {message: "Password cannot be more than 20 characters long."}),

  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(50, { message: "Username cannot be more than 50 characters." }),

  gender: z.enum(["male", "female"], { message: "Gender is required" }),
});

// Level 2 for specific characteristics
export const SignUpSchemaL2 = SignUpSchemaL1.extend({
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one digit." }),

  username: z.string().regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores.",
  }),
});

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Usernae is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const updateSchema = z.object({
  profilePic: z.string().optional(),

  fullname: z
    .string()
    .trim()
    .min(6, { message: "Full name must be atleast 6 characters long." })
    .max(255, { message: "Full name cannot be more than 255 characters." })
    .optional(),

  email: z
    .string()
    .trim()
    .email({ message: "Email address is required" })
    .max(320, { message: "Please enter a valid email address." })
    .optional(),
});
