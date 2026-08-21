import express from "express";
import {
  checkout,
  verifyOrderPayment,
  listMyOrders,
  getOrder,
  cancelMyOrder,
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { checkoutSchema, verifyPaymentSchema } from "../validators/order.validator.js";

const router = express.Router();

// ==================== ORDER ROUTES ====================
router.post("/checkout", authenticate, validate(checkoutSchema), checkout);
router.post("/verify-payment", authenticate, validate(verifyPaymentSchema), verifyOrderPayment);
router.get("/", authenticate, listMyOrders);
router.get("/:id", authenticate, getOrder);
router.patch("/:id/cancel", authenticate, cancelMyOrder);

export default router;