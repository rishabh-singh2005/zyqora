import {
  createOrder,
  verifyPayment,
  getUserOrders,
  getOrderDetail,
  cancelOrder,
} from "../services/order.service.js";

// ==================== CHECKOUT (Create Order) ====================
export const checkout = async (req, res) => {
  try {
    const result = await createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== VERIFY PAYMENT ====================
export const verifyOrderPayment = async (req, res) => {
  try {
    const order = await verifyPayment(req.user.id, req.body);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== LIST MY ORDERS ====================
export const listMyOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== GET ORDER DETAIL ====================
export const getOrder = async (req, res) => {
  try {
    const order = await getOrderDetail(req.user.id, req.params.id);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== CANCEL ORDER ====================
export const cancelMyOrder = async (req, res) => {
  try {
    const order = await cancelOrder(req.user.id, req.params.id);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};