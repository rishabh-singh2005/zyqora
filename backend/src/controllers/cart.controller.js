import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../services/cart.service.js";

// ==================== GET CART ====================
export const viewCart = async (req, res) => {
  try {
    const cart = await getCart(req.user.id);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== ADD ITEM ====================
export const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const item = await addItemToCart(req.user.id, productId, quantity);
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE ITEM ====================
export const updateItem = async (req, res) => {
  try {
    const item = await updateCartItemQuantity(req.user.id, req.params.productId, req.body.quantity);
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== REMOVE ITEM ====================
export const removeItem = async (req, res) => {
  try {
    await removeItemFromCart(req.user.id, req.params.productId);
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== CLEAR CART ====================
export const emptyCart = async (req, res) => {
  try {
    await clearCart(req.user.id);
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};