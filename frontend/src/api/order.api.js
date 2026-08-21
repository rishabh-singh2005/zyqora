import axiosInstance from "./axiosInstance";

export const checkout = (data) => axiosInstance.post("/api/orders/checkout", data).then((res) => res.data);
export const verifyOrderPayment = (data) =>
  axiosInstance.post("/api/orders/verify-payment", data).then((res) => res.data);
export const getMyOrders = () => axiosInstance.get("/api/orders").then((res) => res.data);
export const getOrderDetail = (id) => axiosInstance.get(`/api/orders/${id}`).then((res) => res.data);
export const cancelOrder = (id) => axiosInstance.patch(`/api/orders/${id}/cancel`).then((res) => res.data);