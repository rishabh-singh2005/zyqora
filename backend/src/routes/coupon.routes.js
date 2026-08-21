import express from "express";
import {
  getCoupons,
  addCoupon,
  editCoupon,
  removeCoupon,
  applyCouponToCart,
} from "../controllers/coupon.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { couponSchema, applyCouponSchema } from "../validators/coupon.validator.js";

const router = express.Router();

// ==================== COUPON ROUTES ====================
router.post("/apply", authenticate, validate(applyCouponSchema), applyCouponToCart);
router.get("/", authenticate, getCoupons);
router.post("/", authenticate, validate(couponSchema), addCoupon);
router.put("/:id", authenticate, editCoupon);
router.delete("/:id", authenticate, removeCoupon);

export default router;