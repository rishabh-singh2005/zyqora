import express from "express";
import { viewCart, addItem, updateItem, removeItem, emptyCart } from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { addItemSchema, updateQuantitySchema } from "../validators/cart.validator.js";

const router = express.Router();

// ==================== CART ROUTES ====================
router.get("/", authenticate, viewCart);
router.post("/items", authenticate, validate(addItemSchema), addItem);
router.put("/items/:productId", authenticate, validate(updateQuantitySchema), updateItem);
router.delete("/items/:productId", authenticate, removeItem);
router.delete("/", authenticate, emptyCart);

export default router;