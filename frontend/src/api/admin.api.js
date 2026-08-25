import axiosInstance from "./axiosInstance";

export const getDashboardStats = () => axiosInstance.get("/api/admin/dashboard/stats").then((res) => res.data);
export const getUsers = (params = {}) => axiosInstance.get("/api/admin/users", { params }).then((res) => res.data);
export const updateUserRole = (id, role) =>
  axiosInstance.patch(`/api/admin/users/${id}/role`, { role }).then((res) => res.data);
export const updateUserStatus = (id, isBanned) =>
  axiosInstance.patch(`/api/admin/users/${id}/status`, { isBanned }).then((res) => res.data);

export const createCategory = (data) =>
  axiosInstance.post("/api/categories", data).then((res) => res.data);
export const updateCategory = (id, data) =>
  axiosInstance.put(`/api/categories/${id}`, data).then((res) => res.data);
export const deleteCategory = (id) =>
  axiosInstance.delete(`/api/categories/${id}`).then((res) => res.data);

export const createProduct = (data) => axiosInstance.post("/api/products", data).then((res) => res.data);
export const updateProduct = (id, data) => axiosInstance.put(`/api/products/${id}`, data).then((res) => res.data);
export const deleteProduct = (id) => axiosInstance.delete(`/api/products/${id}`).then((res) => res.data);
export const uploadProductImages = (id, formData) =>
  axiosInstance
    .post(`/api/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const getAllOrders = (params = {}) =>
  axiosInstance.get("/api/admin/orders", { params }).then((res) => res.data);
export const getAdminProducts = (params = {}) =>
  axiosInstance.get("/api/products/admin/list", { params }).then((res) => res.data);
export const updateOrderStatus = (id, status) =>
  axiosInstance.patch(`/api/admin/orders/${id}/status`, { status }).then((res) => res.data);

export const getAllCoupons = () => axiosInstance.get("/api/coupons").then((res) => res.data);
export const createCoupon = (data) => axiosInstance.post("/api/coupons", data).then((res) => res.data);
export const updateCoupon = (id, data) => axiosInstance.put(`/api/coupons/${id}`, data).then((res) => res.data);
export const deleteCoupon = (id) => axiosInstance.delete(`/api/coupons/${id}`).then((res) => res.data);

export const adjustProductStock = (id, quantityChange) =>
  axiosInstance.patch(`/api/products/${id}/stock`, { quantityChange }).then((res) => res.data);
