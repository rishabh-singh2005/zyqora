import crypto from "crypto";
import { prisma } from "../config/db.js";
import razorpay from "../config/razorpay.js";
import { applyCoupon } from "./coupon.service.js";
import { createNotification } from "./notification.service.js";

// ==================== CREATE ORDER (Checkout) ====================
export const createOrder = async (userId, { addressId, couponCode }) => {
  // 1. Verify address belongs to this user
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Get cart — NEVER trust totals sent from frontend
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  // 3. Check stock availability for every item
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for ${item.product.name}`);
      error.statusCode = 400;
      throw error;
    }
  }

  // 4. Calculate subtotal from actual DB prices, not client-supplied ones
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // 5. Apply coupon if provided
  let discount = 0;
  if (couponCode) {
    const couponResult = await applyCoupon(couponCode, subtotal);
    discount = couponResult.discountAmount;
  }

  const shippingFee = subtotal > 2000 ? 0 : 99; // free shipping over ₹2000
  const total = subtotal - discount + shippingFee;

  // 6. Create Razorpay order (amount in paise)
  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  // 7. Create our own Order record (status PENDING until payment verified)
  const order = await prisma.order.create({
    data: {
      userId,
      addressId,
      status: "PENDING",
      subtotal,
      discount,
      shippingFee,
      total,
      couponCode: couponCode || null,
      razorpayOrderId: razorpayOrder.id,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  });

  return {
    order,
    razorpayOrderId: razorpayOrder.id,
    amount: total * 100,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
  };
};

// ==================== VERIFY PAYMENT ====================
export const verifyPayment = async (userId, { razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  // 1. Verify the signature — THIS is the critical security step
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    const error = new Error("Payment verification failed");
    error.statusCode = 400;
    throw error;
  }

  // 2. Find our order by the razorpay order id
  const order = await prisma.order.findFirst({
    where: { razorpayOrderId, userId },
    include: { items: true },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // 3. Mark order as PAID
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });

  // 4. Record the payment
  await prisma.payment.create({
    data: {
      userId,
      purpose: "ORDER",
      orderId: order.id,
      razorpayOrderId,
      razorpayPaymentId,
      amount: order.total,
      status: "PAID",
    },
  });

  // 5. Decrement stock for each item (in a transaction, all-or-nothing)
  await prisma.$transaction(
    order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // 6. Clear the user's cart
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }



  // 7. Fetch fresh order data to return (previous variable is stale)
  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { items: true },
  });

  // ==================== NOTIFY USER ====================
  await createNotification(
    userId,
    "Order Placed",
    `Your order for ₹${order.total} has been placed successfully.`
  );

  return updatedOrder;
};

// ==================== LIST USER'S ORDERS ====================
export const getUserOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, address: true },
    orderBy: { placedAt: "desc" },
  });
};

// ==================== GET ORDER DETAIL ====================
export const getOrderDetail = async (userId, orderId) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true, address: true, payments: true },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

// ==================== CANCEL ORDER ====================
export const cancelOrder = async (userId, orderId) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId } });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (["SHIPPED", "DELIVERED"].includes(order.status)) {
    const error = new Error("Cannot cancel an order that has already shipped");
    error.statusCode = 400;
    throw error;
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
};