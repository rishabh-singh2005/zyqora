import { getProductReviews, addReview, deleteReview } from "../services/review.service.js";

// ==================== LIST REVIEWS ====================
export const listReviews = async (req, res) => {
  try {
    const reviews = await getProductReviews(req.params.id);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== ADD REVIEW ====================
export const createReview = async (req, res) => {
  try {
    const review = await addReview(req.user.id, req.params.id, req.body);
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE REVIEW ====================
export const removeReview = async (req, res) => {
  try {
    await deleteReview(req.user.id, req.user.role, req.params.reviewId);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};