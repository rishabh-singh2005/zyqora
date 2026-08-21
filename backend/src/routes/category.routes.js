import express from "express";
import {
  listCategories,
  addCategory,
  editCategory,
  removeCategory,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { categorySchema } from "../validators/category.validator.js";

const router = express.Router();

// ==================== CATEGORY ROUTES ====================
router.get("/", listCategories);
router.post("/", authenticate, validate(categorySchema), addCategory);
router.put("/:id", authenticate, editCategory);
router.delete("/:id", authenticate, removeCategory);

export default router;