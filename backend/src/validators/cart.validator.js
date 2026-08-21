import { z } from "zod";

// ==================== ADD ITEM VALIDATION ====================
export const addItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive().optional(),
});

// ==================== UPDATE QUANTITY VALIDATION ====================
export const updateQuantitySchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be 0 or more"),
});