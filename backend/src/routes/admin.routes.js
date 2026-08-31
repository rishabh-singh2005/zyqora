import express from "express";
import {
  getUsers,
  changeUserRole,
  changeUserBanStatus,
  dashboard,
  getAllOrdersAdmin,
  changeOrderStatus,
  deleteUser
} from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

// ==================== ADMIN ROUTES ====================
router.get("/users", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getUsers);
router.patch("/users/:id/role", authenticate, authorize("SUPER_ADMIN"), changeUserRole);
router.patch("/users/:id/status", authenticate, authorize("ADMIN", "SUPER_ADMIN"), changeUserBanStatus);
router.get("/dashboard/stats", authenticate, authorize("ADMIN", "SUPER_ADMIN"), dashboard);
router.get("/orders", authenticate, authorize("ADMIN", "SUPER_ADMIN"), getAllOrdersAdmin);
router.patch("/orders/:id/status", authenticate, authorize("ADMIN", "SUPER_ADMIN"), changeOrderStatus);
router.delete("/users/:id", authenticate, authorize("SUPER_ADMIN"), deleteUser );

export default router;