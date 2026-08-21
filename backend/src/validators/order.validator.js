import { z } from "zod";

// ==================== CHECKOUT VALIDATION ====================
export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Address is required"),
  couponCode: z.string().optional(),
});

// ==================== VERIFY PAYMENT VALIDATION ====================
export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});