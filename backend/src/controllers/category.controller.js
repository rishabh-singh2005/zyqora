import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

// ==================== LIST CATEGORIES ====================
export const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== ADD CATEGORY ====================
export const addCategory = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== EDIT CATEGORY ====================
export const editCategory = async (req, res) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== REMOVE CATEGORY ====================
export const removeCategory = async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};