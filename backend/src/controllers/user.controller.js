import { getUserProfile, updateUserProfile } from "../services/user.service.js";
import { updateUserAvatar } from "../services/user.service.js";
import { generateProfilePDF } from "../services/user.service.js";


// ==================== GET PROFILE ====================
export const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE PROFILE ====================
export const updateProfile = async (req, res) => {
  try {
    const user = await updateUserProfile(req.user.id, req.body);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPLOAD AVATAR ====================
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const user = await updateUserAvatar(req.user.id, req.file.path);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
// ==================== DOWNLOAD PROFILE PDF ====================
export const downloadProfile = async (req, res) => {
  try {
    const doc = await generateProfilePDF(req.user.id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=profile.pdf");

    doc.pipe(res);
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};