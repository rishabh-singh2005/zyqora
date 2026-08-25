import { prisma } from "../config/db.js";

// ==================== LIST COUPONS (admin) ====================
export const listCoupons = async () => {
  return prisma.coupon.findMany({ orderBy: { expiresAt: "asc" } });
};

// ==================== CREATE COUPON ====================
export const createCoupon = async (data) => {
  const { code, discountPct, maxDiscount, minOrderValue, expiresAt } = data;

  const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) {
    const error = new Error("Coupon code already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountPct: Number(discountPct),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      minOrderValue: Number(minOrderValue) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
};

// ==================== UPDATE COUPON ====================
export const updateCoupon = async (id, data) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  const { code, discountPct, maxDiscount, minOrderValue, expiresAt } = data;

  return prisma.coupon.update({
    where: { id },
    data: {
      code: code.trim().toUpperCase(),
      discountPct: Number(discountPct),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      minOrderValue: Number(minOrderValue) || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
};

// ==================== DELETE COUPON ====================
export const deleteCoupon = async (id) => {
  const coupon = await prisma.coupon.findUnique({ where: { id } });
  if (!coupon) {
    const error = new Error("Coupon not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.coupon.delete({ where: { id } });
};

// ==================== APPLY COUPON (validate against cart total) ====================
export const applyCoupon = async (code, cartTotal) => {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    const error = new Error("Invalid coupon code");
    error.statusCode = 400;
    throw error;
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    const error = new Error("Coupon has expired");
    error.statusCode = 400;
    throw error;
  }

  if (cartTotal < coupon.minOrderValue) {
    const error = new Error(`Minimum order value of ₹${coupon.minOrderValue} required`);
    error.statusCode = 400;
    throw error;
  }

  let discount = Math.round((cartTotal * coupon.discountPct) / 100);

  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  return {
    code: coupon.code,
    discountPct: coupon.discountPct,
    discountAmount: discount,
    finalTotal: cartTotal - discount,
  };
};
