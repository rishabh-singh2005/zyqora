import jwt from "jsonwebtoken";

// ==================== GENERATE ACCESS TOKEN ====================
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

// ==================== GENERATE REFRESH TOKEN ====================
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ==================== VERIFY REFRESH TOKEN ====================
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};