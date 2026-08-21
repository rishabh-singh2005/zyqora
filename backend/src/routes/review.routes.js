import express from "express";
import { removeReview } from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// ==================== DELETE REVIEW ====================
router.delete("/:reviewId", authenticate, removeReview);

export default router;