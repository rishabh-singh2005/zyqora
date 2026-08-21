import { prisma } from "../config/db.js";

// ==================== GET OR CREATE CART ====================
const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  return cart;
};

// ==================== GET CART (with items) ====================
export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  return prisma.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: { product: { include: { images: true } } },
      },
    },
  });
};

// ==================== ADD ITEM TO CART ====================
export const addItemToCart = async (userId, productId, quantity = 1) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || !product.isActive) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error("Insufficient stock");
    error.statusCode = 400;
    throw error;
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity },
  });
};

// ==================== UPDATE ITEM QUANTITY ====================
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!item) {
    const error = new Error("Item not in cart");
    error.statusCode = 404;
    throw error;
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return null;
  }

  return prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });
};

// ==================== REMOVE ITEM FROM CART ====================
export const removeItemFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);

  const item = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (!item) {
    const error = new Error("Item not in cart");
    error.statusCode = 404;
    throw error;
  }

  await prisma.cartItem.delete({ where: { id: item.id } });
};

// ==================== CLEAR CART ====================
export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};