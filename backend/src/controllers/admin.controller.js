import { listUsers, updateUserRole, toggleUserBan, getDashboardStats, deleteUserService } from "../services/admin.service.js";

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

//=============Delete User===========================
export const deleteUser = async (req, res) => {
  try{
  const response = await deleteUserService(req.params.id);
  res.status(200).json({success : true, response});
  }
  catch(error){
    res.status(error.statusCode || 500).json ({success: false, message: error.message});
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