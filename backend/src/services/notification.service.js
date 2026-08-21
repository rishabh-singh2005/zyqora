import { prisma } from "../config/db.js";

// ==================== CREATE NOTIFICATION (internal helper, used by other services) ====================
export const createNotification = async (userId, title, message) => {
  return prisma.notification.create({
    data: { userId, title, message },
  });
};

// ==================== GET MY NOTIFICATIONS ====================
export const getMyNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

// ==================== MARK AS READ ====================
export const markNotificationRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

// ==================== GET UNREAD COUNT ====================
export const getUnreadCount = async (userId) => {
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return count;
};