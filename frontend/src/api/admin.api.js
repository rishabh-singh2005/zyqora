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
