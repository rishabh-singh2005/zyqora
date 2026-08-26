import express from "express";
import passport from "passport";
import { signup, login, verifyEmail, refresh, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import { generateRefreshToken } from "../services/token.service.js";
import { prisma } from "../config/db.js";
import { refreshCookieOptions } from "../utils/refreshCookie.js";

const router = express.Router();

// ==================== SIGNUP ROUTE ====================
router.post("/signup", validate(signupSchema), signup);

// ==================== LOGIN ROUTE ====================
router.post("/login", validate(loginSchema), login);

// ==================== VERIFY EMAIL ROUTE ====================
router.get("/verify/:token", verifyEmail);

// ==================== REFRESH & LOGOUT ROUTES ====================
router.post("/refresh", refresh);
router.post("/logout", logout);

// ==================== GOOGLE OAUTH ROUTES ====================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  async (req, res) => {
    const user = req.user;
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
  }
);

// ==================== FACEBOOK OAUTH ROUTES ====================
router.get(
  "/facebook",
  passport.authenticate("facebook", { session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login-failed" }),
  async (req, res) => {
    const user = req.user;
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.redirect(`${process.env.CLIENT_URL}/oauth-success`);
  }
);

export default router;
