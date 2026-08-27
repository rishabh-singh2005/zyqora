import express from "express";
import passport from "passport";
import {
  signup,
  login,
  verifyEmail,
  resendVerification,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  signupSchema,
  loginSchema,
  resendVerificationSchema,
} from "../validators/auth.validator.js";
import { generateRefreshToken } from "../services/token.service.js";
import { prisma } from "../config/db.js";
import { refreshCookieOptions } from "../utils/refreshCookie.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail, getClientUrl } from "../services/email.service.js";

const router = express.Router();

// ==================== SIGNUP ROUTE ====================
router.post("/signup", validate(signupSchema), signup);

// ==================== LOGIN ROUTE ====================
router.post("/login", validate(loginSchema), login);

// ==================== RESEND VERIFICATION ROUTE ====================
router.post(
  "/resend-verification",
  validate(resendVerificationSchema),
  resendVerification
);

// ==================== VERIFY EMAIL ROUTES ====================
// Support both GET (for direct frontend link clicks) and POST
router.get("/verify/:token", verifyEmail);
router.post("/verify/:token", verifyEmail);

// ==================== REFRESH & LOGOUT ROUTES ====================
router.post("/refresh", refresh);
router.post("/logout", logout);

// ==================== GOOGLE OAUTH ROUTES ====================
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

const completeOAuthLogin = async (req, res) => {
  const user = req.user;
  const clientOrigin = req.headers.origin || req.headers.referer || "";
  const clientUrl = getClientUrl(clientOrigin);

  // OAuth proves account ownership with the provider, but if unverified, send link
  if (!user.isEmailVerified) {
    const verificationToken = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (emailErr) {
      console.error("⚠️ [OAuth] Failed to send verification email during OAuth login:", emailErr.message);
    }

    return res.redirect(`${clientUrl}/login?verification=sent`);
  }

  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  return res.redirect(`${clientUrl}/oauth-success`);
};

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
  completeOAuthLogin
);

// ==================== FACEBOOK OAUTH ROUTES ====================
router.get(
  "/facebook",
  passport.authenticate("facebook", { session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login-failed" }),
  completeOAuthLogin
);

export default router;
