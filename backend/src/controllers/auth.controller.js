import {
  signupUser,
  loginUser,
  verifyUserEmail,
  resendVerificationToken,
  refreshAccessToken,
  logoutUser,
} from "../services/auth.service.js";
import { getClientUrl } from "../services/email.service.js";
import { refreshCookieOptions } from "../utils/refreshCookie.js";

// ==================== SIGNUP ====================
export const signup = async (req, res) => {
  try {
    const clientOrigin = req.headers.origin || req.headers.referer || "";
    const user = await signupUser(req.body, clientOrigin);
    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      userId: user.id,
      emailSent: user.emailSent,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==================== RESEND VERIFICATION ====================
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const clientOrigin = req.headers.origin || req.headers.referer || "";
    const result = await resendVerificationToken(email, clientOrigin);
    res.status(200).json({
      success: true,
      message: result.message,
      alreadyVerified: !!result.alreadyVerified,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const clientOrigin = req.headers.origin || req.headers.referer || "";
    const { accessToken, refreshToken, user } = await loginUser(req.body, clientOrigin);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(200).json({ success: true, accessToken, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== VERIFY EMAIL ====================
export const verifyEmail = async (req, res) => {
  const clientOrigin = req.headers.origin || req.headers.referer || "";
  const clientUrl = getClientUrl(clientOrigin);

  try {
    const { token } = req.params;
    const { email } = await verifyUserEmail(token);

    // If opened directly as a document in browser navigation (e.g. from an email link)
    const isBrowserNavigation =
      !req.xhr &&
      (req.headers["sec-fetch-dest"] === "document" ||
        (req.headers.accept && req.headers.accept.includes("text/html")));

    if (isBrowserNavigation) {
      return res.redirect(`${clientUrl}/?verified=true&email=${encodeURIComponent(email)}`);
    }

    res.status(200).json({
      success: true,
      message: `Email ${email} verified successfully`,
      redirectUrl: `${clientUrl}/`,
    });
  } catch (error) {
    const isBrowserNavigation =
      !req.xhr &&
      (req.headers["sec-fetch-dest"] === "document" ||
        (req.headers.accept && req.headers.accept.includes("text/html")));

    if (isBrowserNavigation) {
      return res.redirect(`${clientUrl}/login?error=${encodeURIComponent(error.message)}`);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== REFRESH TOKEN ====================
export const refresh = async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await refreshAccessToken(incomingToken);

    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================== LOGOUT ====================
export const logout = async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    await logoutUser(incomingToken);

    res.clearCookie("refreshToken", refreshCookieOptions);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};
