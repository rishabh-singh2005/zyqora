import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/address.service.js";

// ==================== GET ADDRESSES ====================
export const listAddresses = async (req, res) => {
  try {
    const addresses = await getUserAddresses(req.user.id);
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== ADD ADDRESS ====================
export const addAddress = async (req, res) => {
  try {
    const address = await createAddress(req.user.id, req.body);
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== EDIT ADDRESS ====================
export const editAddress = async (req, res) => {
  try {
    const address = await updateAddress(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== REMOVE ADDRESS ====================
export const removeAddress = async (req, res) => {
  try {
    await deleteAddress(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== MARK DEFAULT ====================
export const markDefaultAddress = async (req, res) => {
  try {
    const address = await setDefaultAddress(req.user.id, req.params.id);
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};