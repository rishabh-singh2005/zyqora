import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/db.js";
import { generateAccessToken, generateRefreshToken } from "./token.service.js";
import { verifyRefreshToken } from "./token.service.js";
import { sendVerificationEmail } from "./email.service.js";

// ==================== SIGNUP ====================
export const signupUser = async ({ email, password, name }, clientOrigin = "") => {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  // If user exists and is already verified, block registration
  if (existingUser && existingUser.isEmailVerified) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = uuidv4();

  let user;
  if (existingUser && !existingUser.isEmailVerified) {
    // If unverified user tries to sign up again, update credentials & new verification token
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: name || existingUser.name,
        password: hashedPassword,
        verificationToken,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
      },
    });
  } else {
    // Brand new user registration
    user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isEmailVerified: true,
      },
    });
  }

  // Dispatch verification email in a resilient manner (never throws to block signup)
  let emailSent = false;
  try {
    const result = await sendVerificationEmail(user.email, verificationToken, user.name, clientOrigin);
    emailSent = !!result?.success;
  } catch (emailErr) {
    console.error("⚠️ [AuthService] Failed to send verification email during signup:", emailErr.message);
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isEmailVerified: user.isEmailVerified,
    emailSent,
    message: "Signup successful. Please verify your email.",
  };
};

// ==================== RESEND VERIFICATION EMAIL ====================
export const resendVerificationToken = async (email, clientOrigin = "") => {
  const user = await prisma.user.findUnique({ where: { email } });

  // For security, do not expose whether an email exists
  if (!user) {
    return {
      message: "If this email is registered, a verification link has been sent.",
    };
  }

  if (user.isEmailVerified) {
    return {
      message: "Your email is already verified. You can log in directly.",
      alreadyVerified: true,
    };
  }

  const verificationToken = uuidv4();
  await prisma.user.update({
    where: { id: user.id },
    data: { verificationToken },
  });

  try {
    await sendVerificationEmail(user.email, verificationToken, user.name, clientOrigin);
  } catch (emailErr) {
    console.error("⚠️ [AuthService] Failed to resend verification email:", emailErr.message);
  }

  return {
    message: "A new verification link has been sent to your email.",
  };
};

// ==================== LOGIN ====================
export const loginUser = async ({ email, password }, clientOrigin = "") => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isEmailVerified) {
    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    // Safely attempt to resend verification email without crashing with 500
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name, clientOrigin);
    } catch (emailErr) {
      console.error("⚠️ [AuthService] Failed to send verification email on login attempt:", emailErr.message);
    }

    const error = new Error(
      "Please verify your email before logging in. A new verification link has been sent to your email."
    );
    error.statusCode = 403;
    throw error;
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};

// ==================== VERIFY EMAIL ====================
export const verifyUserEmail = async (token) => {
  if (!token) {
    const error = new Error("Verification token is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  });

  if (!user) {
    const error = new Error("Invalid or expired verification link");
    error.statusCode = 400;
    throw error;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: null,
    },
  });

  return { email: user.email };
};

// ==================== REFRESH ACCESS TOKEN ====================
export const refreshAccessToken = async (incomingToken) => {
  if (!incomingToken) {
    const error = new Error("Refresh token missing");
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      userId: decoded.userId,
      tokenHash: incomingToken,
      revoked: false,
    },
  });

  if (!storedToken) {
    const error = new Error("Refresh token not recognized");
    error.statusCode = 401;
    throw error;
  }

  // rotate: revoke the old one, issue a new pair
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

  const newAccessToken = generateAccessToken(user.id, user.role);
  const newRefreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { newAccessToken, newRefreshToken };
};

// ==================== LOGOUT ====================
export const logoutUser = async (incomingToken) => {
  if (!incomingToken) return;

  await prisma.refreshToken.updateMany({
    where: { tokenHash: incomingToken },
    data: { revoked: true },
  });
};
