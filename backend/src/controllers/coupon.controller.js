import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../services/coupon.service.js";
import { getCart } from "../services/cart.service.js";

// ==================== LIST COUPONS ====================
export const getCoupons = async (req, res) => {
  try {
    const coupons = await listCoupons();
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE COUPON ====================
export const addCoupon = async (req, res) => {
  try {
    const coupon = await createCoupon(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE COUPON ====================
export const editCoupon = async (req, res) => {
  try {
    const coupon = await updateCoupon(req.params.id, req.body);
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE COUPON ====================
export const removeCoupon = async (req, res) => {
  try {
    await deleteCoupon(req.params.id);
    res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== APPLY COUPON TO CART ====================
export const applyCouponToCart = async (req, res) => {
  try {
    const cart = await getCart(req.user.id);
    const cartTotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const result = await applyCoupon(req.body.code, cartTotal);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};