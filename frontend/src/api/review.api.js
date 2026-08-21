import axiosInstance from "./axiosInstance";

export const submitReview = (productId, data) =>
  axiosInstance.post(`/api/products/${productId}/reviews`, data).then((res) => res.data);