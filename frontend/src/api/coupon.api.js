import axiosInstance from "./axiosInstance";

export const applyCoupon = (code) =>
  axiosInstance.post("/api/coupons/apply", { code }).then((res) => res.data);