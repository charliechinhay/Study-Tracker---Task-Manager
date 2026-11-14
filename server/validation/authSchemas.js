import { z } from "zod";

// trim + toLowerCase control applied before validation: " Mario@X.com " becomes "mario@x.com"
const emailField = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .email("Invalid email");

export const registerSchema = z.object({
  email: emailField,
  // bcrypt uses only the first 72 bytes: anything beyond that would be ignored
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

// users with old short passwords must be able to log in
export const loginSchema = z.object({
  email: emailField,
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});