import express from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  uploadProductImages,
  updateStock,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { productSchema } from "../validators/product.validator.js";
import { uploadProductImage } from "../middlewares/upload.js";
import { listReviews, createReview } from "../controllers/review.controller.js";
import { reviewSchema } from "../validators/review.validator.js";
import { getProductsAdmin } from "../controllers/product.controller.js";


const router = express.Router();

// ==================== PRODUCT ROUTES ====================
router.get("/", getProducts);
router.get("/:slug", getProduct);
router.post("/", authenticate, validate(productSchema), addProduct);
router.put("/:id", authenticate, editProduct);
router.delete("/:id", authenticate, removeProduct);
router.post("/:id/images", authenticate, uploadProductImage.array("images", 5), uploadProductImages);
router.patch("/:id/stock", authenticate, updateStock);
router.get("/admin/list", authenticate, getProductsAdmin);


// ==================== PRODUCT REVIEW ROUTES ====================
router.get("/:id/reviews", listReviews);
router.post("/:id/reviews", authenticate, validate(reviewSchema), createReview);

export default router;