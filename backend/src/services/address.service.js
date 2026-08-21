import { prisma } from "../config/db.js";

// ==================== GET ALL ADDRESSES ====================
export const getUserAddresses = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
};

// ==================== CREATE ADDRESS ====================
export const createAddress = async (userId, data) => {
  const { fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = data;

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country: country || "India",
      isDefault: !!isDefault,
    },
  });
};

// ==================== UPDATE ADDRESS ====================
export const updateAddress = async (userId, addressId, data) => {
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.address.update({
    where: { id: addressId },
    data,
  });
};

// ==================== DELETE ADDRESS ====================
export const deleteAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.address.delete({ where: { id: addressId } });
};

// ==================== SET DEFAULT ADDRESS ====================
export const setDefaultAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  return prisma.address.update({
    where: { id: addressId },
    data: { isDefault: true },
  });
};