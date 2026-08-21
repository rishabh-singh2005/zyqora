import { z } from "zod";

// ==================== UPDATE PROFILE VALIDATION ====================
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});