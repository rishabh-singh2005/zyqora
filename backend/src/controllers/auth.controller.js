import { signupUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";
import { verifyUserEmail } from "../services/auth.service.js";
import { refreshAccessToken } from "../services/auth.service.js";
import { logoutUser } from "../services/auth.service.js";
import { refreshCookieOptions } from "../utils/refreshCookie.js";



//=============SIGNUP=======================================
export const signup = async (req, res) => {
  try {
    const user = await signupUser(req.body);
    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
      userId: user.id,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await loginUser(req.body);

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
  try {
    const { token } = req.params;
    const { email } = await verifyUserEmail(token);

    res.status(200).json({
      success: true,
      message: `Email ${email} verified successfully`,
    });
  } catch (error) {
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




