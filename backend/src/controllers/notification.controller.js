import { getMyNotifications, markNotificationRead, getUnreadCount } from "../services/notification.service.js";

// ==================== LIST NOTIFICATIONS ====================
export const listNotifications = async (req, res) => {
  try {
    const notifications = await getMyNotifications(req.user.id);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== MARK AS READ ====================
export const readNotification = async (req, res) => {
  try {
    const notification = await markNotificationRead(req.user.id, req.params.id);
    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UNREAD COUNT ====================
export const unreadCount = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.id);
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};