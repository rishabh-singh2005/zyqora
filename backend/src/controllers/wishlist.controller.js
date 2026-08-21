import { getWishlist, addToWishlist, removeFromWishlist } from "../services/wishlist.service.js";

// ==================== VIEW WISHLIST ====================
export const viewWishlist = async (req, res) => {
  try {
    const wishlist = await getWishlist(req.user.id);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== ADD ITEM ====================
export const addWishlistItem = async (req, res) => {
  try {
    const item = await addToWishlist(req.user.id, req.params.productId);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== REMOVE ITEM ====================
export const removeWishlistItem = async (req, res) => {
  try {
    await removeFromWishlist(req.user.id, req.params.productId);
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};