import { z } from "zod";

// ==================== ADDRESS VALIDATION ====================
export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  line1: z.string().min(3, "Address line is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});