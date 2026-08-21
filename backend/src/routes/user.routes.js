import express from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../validators/user.validator.js";
import { uploadAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.js";
import { downloadProfile } from "../controllers/user.controller.js";

const router = express.Router();

// ==================== PROFILE ROUTES ====================
router.get("/me", authenticate, getProfile);
router.put("/me", authenticate, validate(updateProfileSchema), updateProfile);

// ==================== AVATAR UPLOAD ROUTE ====================
router.post("/me/avatar", authenticate, upload.single("avatar"), uploadAvatar);

// ==================== DOWNLOAD PROFILE ====================
router.get("/me/download", authenticate, downloadProfile);

export default router;