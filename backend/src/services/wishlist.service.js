import { prisma } from "../config/db.js";

// ==================== GET WISHLIST ====================
export const getWishlist = async (userId) => {
  return prisma.wishlist.findMany({
    where: { userId },
    include: { product: { include: { images: true } } },
  });
};

// ==================== ADD TO WISHLIST ====================
export const addToWishlist = async (userId, productId) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || !product.isActive) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    const error = new Error("Product already in wishlist");
    error.statusCode = 409;
    throw error;
  }

  return prisma.wishlist.create({ data: { userId, productId } });
};

// ==================== REMOVE FROM WISHLIST ====================
export const removeFromWishlist = async (userId, productId) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (!existing) {
    const error = new Error("Product not in wishlist");
    error.statusCode = 404;
    throw error;
  }

  await prisma.wishlist.delete({
    where: { userId_productId: { userId, productId } },
  });
};