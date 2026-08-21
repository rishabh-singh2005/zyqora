import axiosInstance from "./axiosInstance";

export const fetchProducts = (params = {}) =>
  axiosInstance.get("/api/products", { params }).then((res) => res.data);

export const fetchProductBySlug = (slug) =>
  axiosInstance.get(`/api/products/${slug}`).then((res) => res.data);

export const fetchCategories = () =>
  axiosInstance.get("/api/categories").then((res) => res.data);