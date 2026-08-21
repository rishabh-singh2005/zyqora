import { z } from "zod";

// ==================== PURCHASE PLAN VALIDATION ====================
export const purchasePlanSchema = z.object({
  planType: z.enum(["SILVER", "GOLD"]),
  duration: z.enum(["ONE_HOUR", "SIX_HOURS", "TWELVE_HOURS"]),
});

// ==================== VERIFY PLAN VALIDATION ====================
export const verifyPlanSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  planType: z.enum(["SILVER", "GOLD"]),
  duration: z.enum(["ONE_HOUR", "SIX_HOURS", "TWELVE_HOURS"]),
});