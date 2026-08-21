import crypto from "crypto";
import { prisma } from "../config/db.js";
import razorpay from "../config/razorpay.js";
import { createNotification } from "./notification.service.js";

// ==================== PLAN CONFIG (price + duration in ms) ====================
const PLAN_CONFIG = {
  FREE: { price: 0, durations: {} },
  SILVER: {
    price: {
      ONE_HOUR: 49,
      SIX_HOURS: 199,
      TWELVE_HOURS: 349,
    },
  },
  GOLD: {
    price: {
      ONE_HOUR: 99,
      SIX_HOURS: 399,
      TWELVE_HOURS: 699,
    },
  },
};

const DURATION_MS = {
  ONE_HOUR: 60 * 60 * 1000,
  SIX_HOURS: 6 * 60 * 60 * 1000,
  TWELVE_HOURS: 12 * 60 * 60 * 1000,
};

// ==================== GET AVAILABLE PLANS ====================
export const getAvailablePlans = () => {
  return PLAN_CONFIG;
};

// ==================== PURCHASE PLAN (create Razorpay order) ====================
export const purchasePlan = async (userId, { planType, duration }) => {
  if (planType === "FREE") {
    const error = new Error("Free plan does not require payment");
    error.statusCode = 400;
    throw error;
  }

  const price = PLAN_CONFIG[planType]?.price?.[duration];
  if (!price) {
    const error = new Error("Invalid plan type or duration");
    error.statusCode = 400;
    throw error;
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: price * 100,
    currency: "INR",
    receipt: `plan_${Date.now()}`,
  });

  await prisma.payment.create({
    data: {
      userId,
      purpose: "PLAN",
      planType,
      razorpayOrderId: razorpayOrder.id,
      amount: price,
      status: "CREATED",
    },
  });

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: price * 100,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
    planType,
    duration,
  };
};

// ==================== VERIFY PLAN PAYMENT (activate plan) ====================
export const verifyPlanPayment = async (
  userId,
  { razorpayOrderId, razorpayPaymentId, razorpaySignature, planType, duration }
) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    const error = new Error("Payment verification failed");
    error.statusCode = 400;
    throw error;
  }

  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId, userId, purpose: "PLAN" },
  });

  if (!payment) {
    const error = new Error("Payment record not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { razorpayPaymentId, status: "PAID" },
  });

  // deactivate any currently active plan before activating the new one
  await prisma.userPlan.updateMany({
    where: { userId, isActive: true },
    data: { isActive: false },
  });

  const expiresAt = new Date(Date.now() + DURATION_MS[duration]);

  const userPlan = await prisma.userPlan.create({
    data: {
      userId,
      planType,
      duration,
      expiresAt,
      isActive: true,
    },
  });

  await createNotification(
  userId,
  "Plan Activated",
  `Your ${planType} plan is now active and will expire on ${expiresAt.toDateString()}.`
);

  return userPlan;
};


// ==================== GET MY CURRENT ACTIVE PLAN ====================
export const getMyCurrentPlan = async (userId) => {
  const plan = await prisma.userPlan.findFirst({
    where: { userId, isActive: true, expiresAt: { gt: new Date() } },
    orderBy: { startedAt: "desc" },
  });

  return plan || { planType: "FREE", message: "No active paid plan" };
};

// ==================== EXPIRE OVERDUE PLANS (used by cron job) ====================
export const expireOverduePlans = async () => {
  const result = await prisma.userPlan.updateMany({
    where: { isActive: true, expiresAt: { lte: new Date() } },
    data: { isActive: false },
  });

  return result.count;
};