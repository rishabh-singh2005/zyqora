import { prisma } from "../config/db.js";

// ==================== GET REVIEWS FOR A PRODUCT ====================
export const getProductReviews = async (productId) => {
  return prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, profileImageUrl: true } } },
    orderBy: { createdAt: "desc" },
  });
};

// ==================== ADD REVIEW (purchase-gated) ====================
export const addReview = async (userId, productId, { rating, comment }) => {
  // 1. Confirm the user actually purchased this product (in a PAID order)
  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId, status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    },
  });

  if (!purchase) {
    const error = new Error("You can only review products you have purchased");
    error.statusCode = 403;
    throw error;
  }

  // 2. Prevent duplicate reviews (schema also enforces this, but a clean error message is better than a raw Prisma error)
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    const error = new Error("You have already reviewed this product");
    error.statusCode = 409;
    throw error;
  }

  return prisma.review.create({
    data: { userId, productId, rating, comment },
    include: { user: { select: { id: true, name: true } } },
  });
};

// ==================== DELETE REVIEW ====================
export const deleteReview = async (userId, userRole, reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = review.userId === userId;
  const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(userRole);

  if (!isOwner && !isAdmin) {
    const error = new Error("You can only delete your own reviews");
    error.statusCode = 403;
    throw error;
  }

  await prisma.review.delete({ where: { id: reviewId } });
};