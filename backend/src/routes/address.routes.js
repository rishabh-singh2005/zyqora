import express from "express";
import {
  listAddresses,
  addAddress,
  editAddress,
  removeAddress,
  markDefaultAddress,
} from "../controllers/address.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import { addressSchema } from "../validators/address.validator.js";

const router = express.Router();

// ==================== ADDRESS ROUTES ====================
router.get("/", authenticate, listAddresses);
router.post("/", authenticate, validate(addressSchema), addAddress);
router.put("/:id", authenticate, editAddress);
router.delete("/:id", authenticate, removeAddress);
router.patch("/:id/default", authenticate, markDefaultAddress);

export default router;