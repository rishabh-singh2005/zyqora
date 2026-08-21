import { prisma } from "../config/db.js";
import PDFDocument from "pdfkit";

// ==================== GET PROFILE ====================
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isEmailVerified: true,
      profileImageUrl: true,
      address: true,
      lat: true,
      lng: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// ==================== UPDATE PROFILE ====================
export const updateUserProfile = async (userId, data) => {
  const { name, address, lat, lng } = data;

  return prisma.user.update({
    where: { id: userId },
    data: { name, address, lat, lng },
    select: {
      id: true,
      email: true,
      name: true,
      address: true,
      lat: true,
      lng: true,
    },
  });
};

// ==================== UPDATE AVATAR ====================
export const updateUserAvatar = async (userId, imageUrl) => {
  return prisma.user.update({
    where: { id: userId },
    data: { profileImageUrl: imageUrl },
    select: { id: true, profileImageUrl: true },
  });
};

// ==================== GENERATE PROFILE PDF ====================
export const generateProfilePDF = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { addresses: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const doc = new PDFDocument({ margin: 50 });

  // ==================== HEADER ====================
  doc.fontSize(20).text("Profile Information", { align: "center" });
  doc.moveDown(2);

  // ==================== BASIC DETAILS ====================
  doc.fontSize(12).text(`Name: ${user.name || "-"}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Role: ${user.role}`);
  doc.text(`Email Verified: ${user.isEmailVerified ? "Yes" : "No"}`);
  doc.text(`Member Since: ${user.createdAt.toDateString()}`);
  doc.moveDown();

  // ==================== ADDRESS DETAILS ====================
  if (user.addresses.length > 0) {
    doc.fontSize(14).text("Saved Addresses", { underline: true });
    doc.moveDown(0.5);

    user.addresses.forEach((addr, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${addr.fullName}, ${addr.phone}\n   ${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}, ${addr.city}, ${addr.state} - ${addr.postalCode}${addr.isDefault ? "  [Default]" : ""}`
      );
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(12).text("No saved addresses.");
  }

  doc.end();
  return doc;
};