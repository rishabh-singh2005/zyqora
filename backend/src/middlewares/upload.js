import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ==================== CLOUDINARY STORAGE CONFIG ====================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-mini-project/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill" }],
  },
});

// ==================== PRODUCT IMAGE STORAGE ====================
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce-mini-project/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadProductImage = multer({ storage: productStorage });

export const upload = multer({ storage });