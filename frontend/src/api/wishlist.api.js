import axiosInstance from "./axiosInstance";

export const getWishlist = () => axiosInstance.get("/api/wishlist").then((res) => res.data);
export const addToWishlist = (productId) =>
  axiosInstance.post(`/api/wishlist/${productId}`).then((res) => res.data);
export const removeFromWishlist = (productId) =>
  axiosInstance.delete(`/api/wishlist/${productId}`).then((res) => res.data);