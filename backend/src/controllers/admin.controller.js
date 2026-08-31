import { listUsers, updateUserRole, toggleUserBan, getDashboardStats, createUserByAdmin, deleteUserByAdmin  } from "../services/admin.service.js";

// ==================== LIST USERS ====================
export const getUsers = async (req, res) => {
  try {
    const result = await listUsers(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE ROLE ====================
export const changeUserRole = async (req, res) => {
  try {
    const user = await updateUserRole(req.params.id, req.body.role);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE USER ====================
export const addUserByAdmin = async (req, res) => {
  try {
    const user = await createUserByAdmin(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE USER ====================
export const removeUserByAdmin = async (req, res) => {
  try {
    await deleteUserByAdmin(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== BAN / UNBAN ====================
export const changeUserBanStatus = async (req, res) => {
  try {
    const user = await toggleUserBan(req.params.id, req.body.isBanned);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== DASHBOARD ====================
export const dashboard = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

import { listAllOrders, updateOrderStatusAdmin } from "../services/admin.service.js";

// ==================== LIST ALL ORDERS ====================
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const result = await listAllOrders(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE ORDER STATUS ====================
export const changeOrderStatus = async (req, res) => {
  try {
    const order = await updateOrderStatusAdmin(req.params.id, req.body.status);
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};