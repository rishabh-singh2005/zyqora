import express from "express";
import { viewWishlist, addWishlistItem, removeWishlistItem } from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// ==================== WISHLIST ROUTES ====================
router.get("/", authenticate, viewWishlist);
router.post("/:productId", authenticate, addWishlistItem);
router.delete("/:productId", authenticate, removeWishlistItem);

export default router;