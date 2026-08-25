import axiosInstance from "./axiosInstance";

export const submitReview = (productId, data) =>
  axiosInstance.post(`/api/products/${productId}/reviews`, data).then((res) => res.data);

export const deleteReview = (reviewId) =>
  axiosInstance.delete(`/api/reviews/${reviewId}`).then((res) => res.data);