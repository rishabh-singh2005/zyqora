import { z } from "zod";

// ==================== REVIEW VALIDATION ====================
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});