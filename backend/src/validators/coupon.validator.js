import { z } from "zod";

// ==================== CREATE COUPON VALIDATION ====================
export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
  discountPct: z.union([z.string(), z.number()]),
  maxDiscount: z.union([z.string(), z.number()]).optional(),
  minOrderValue: z.union([z.string(), z.number()]).optional(),
  expiresAt: z.string().optional(),
});

// ==================== APPLY COUPON VALIDATION ====================
export const applyCouponSchema = z.object({
  code: z.string().min(3, "Coupon code is required"),
});