import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { search, reverse } from "../controllers/geocode.controller.js";

const router = express.Router();

// ==================== GEOCODE ROUTES ====================
router.get("/search", authenticate, search);
router.get("/reverse", authenticate, reverse);

export default router;