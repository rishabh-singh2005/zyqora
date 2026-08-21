import { prisma } from "../config/db.js";
import { createNotification } from "./notification.service.js";

// ==================== LIST USERS (search, filter, sort, pagination) ====================
export const listUsers = async (query) => {
  const { search, role, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
        isBanned: true,
        createdAt: true,
      },
      orderBy: { [sortBy]: order },
      skip,
      take: Number(limit),
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ==================== UPDATE USER ROLE (Super Admin only) ====================
export const updateUserRole = async (targetUserId, newRole) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "SUPER_ADMIN") {
    const error = new Error("Cannot change role of a Super Admin");
    error.statusCode = 403;
    throw error;
  }

  await createNotification(
  targetUserId,
  "Role Updated",
  `You have been promoted to ${newRole}.`
);

  return prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole },
    select: { id: true, email: true, name: true, role: true },
  });
};

// ==================== BAN / UNBAN USER ====================
export const toggleUserBan = async (targetUserId, isBanned) => {
  const user = await prisma.user.findUnique({ where: { id: targetUserId } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role === "SUPER_ADMIN") {
    const error = new Error("Cannot ban a Super Admin");
    error.statusCode = 403;
    throw error;
  }

  return prisma.user.update({
    where: { id: targetUserId },
    data: { isBanned },
    select: { id: true, email: true, isBanned: true },
  });
};

// ==================== DASHBOARD STATS ====================
export const getDashboardStats = async () => {
  const [totalUsers, totalOrders, totalRevenue, totalProducts, lowStockProducts] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { total: true } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stock: { lt: 10 } } }),
  ]);

  return {
    totalUsers,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalProducts,
    lowStockProducts,
  };
};

