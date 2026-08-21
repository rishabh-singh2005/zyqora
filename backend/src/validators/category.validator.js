import { z } from "zod";

// ==================== CATEGORY VALIDATION ====================
export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  parentId: z.string().optional(),
});