import {
  listProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  adjustStock,
} from "../services/product.service.js";

// ==================== LIST PRODUCTS ====================
export const getProducts = async (req, res) => {
  try {
    const result = await listProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== GET SINGLE PRODUCT ====================
export const getProduct = async (req, res) => {
  try {
    const product = await getProductBySlug(req.params.slug);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE PRODUCT ====================
export const addProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE PRODUCT ====================
export const editProduct = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE PRODUCT ====================
export const removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: "Product deactivated" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== UPLOAD PRODUCT IMAGES ====================
export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No images provided" });
    }

    const imageUrls = req.files.map((file) => file.path);
    const images = await addProductImages(req.params.id, imageUrls);

    res.status(201).json({ success: true, images });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ==================== ADJUST STOCK ====================
export const updateStock = async (req, res) => {
  try {
    const product = await adjustStock(req.params.id, req.body.quantityChange);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};