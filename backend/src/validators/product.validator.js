import { z } from "zod";

// ==================== PRODUCT VALIDATION ====================
export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.union([z.string(), z.number()]),
  discountPct: z.union([z.string(), z.number()]).optional(),
  stock: z.union([z.string(), z.number()]).optional(),
  categoryId: z.string().min(1, "Category is required"),
});