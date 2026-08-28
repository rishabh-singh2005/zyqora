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
import { sendVerificationEmail } from "../services/email.service.js";

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

  // IMPORTANT: Do NOT derive clientUrl from req.headers.origin/referer here.
  // This route is hit via a redirect FROM accounts.google.com, so those
  // headers point at Google's domain, not your frontend. Always use the
  // fixed CLIENT_URL env var for OAuth redirects.
  const clientUrl = process.env.CLIENT_URL;

  if (!clientUrl) {
    console.error("❌ [OAuth] CLIENT_URL is not set in environment variables.");
    return res.status(500).send("Server misconfiguration: CLIENT_URL is not set.");
  }

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
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  completeOAuthLogin
);

// ==================== FACEBOOK OAUTH ROUTES ====================
router.get(
  "/facebook",
  passport.authenticate("facebook", { session: false })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  completeOAuthLogin
);

export default router;