import express from "express";
import { listNotifications, readNotification, unreadCount } from "../controllers/notification.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// ==================== NOTIFICATION ROUTES ====================
router.get("/", authenticate, listNotifications);
router.patch("/:id/read", authenticate, readNotification);
router.get("/unread-count", authenticate, unreadCount);

export default router;