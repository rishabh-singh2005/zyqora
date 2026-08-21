import axiosInstance from "./axiosInstance";

export const getCart = () => axiosInstance.get("/api/cart").then((res) => res.data);
export const addToCart = (productId, quantity = 1) =>
  axiosInstance.post("/api/cart/items", { productId, quantity }).then((res) => res.data);
export const updateCartItem = (productId, quantity) =>
  axiosInstance.put(`/api/cart/items/${productId}`, { quantity }).then((res) => res.data);
export const removeCartItem = (productId) =>
  axiosInstance.delete(`/api/cart/items/${productId}`).then((res) => res.data);