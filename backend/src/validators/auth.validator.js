import { z } from "zod";

// ==================== SIGNUP VALIDATION ====================
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  clientUrl: z.string().optional(),
});

// ==================== LOGIN VALIDATION ====================
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  clientUrl: z.string().optional(),
});

// ==================== RESEND VERIFICATION VALIDATION ====================
export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
  clientUrl: z.string().optional(),
});