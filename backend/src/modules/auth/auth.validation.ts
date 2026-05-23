import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters"),
    email: z.string().trim().email("Enter a valid email").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters")
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Enter a valid email").toLowerCase(),
    password: z.string().min(1, "Password is required")
  })
});

export type SignupInput = z.infer<typeof signupSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
