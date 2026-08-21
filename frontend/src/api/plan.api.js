import axiosInstance from "./axiosInstance";

export const getPlans = () => axiosInstance.get("/api/plans").then((res) => res.data);
export const purchasePlan = (data) => axiosInstance.post("/api/plans/purchase", data).then((res) => res.data);
export const verifyPlanPayment = (data) =>
  axiosInstance.post("/api/plans/verify-payment", data).then((res) => res.data);
export const getMyPlan = () => axiosInstance.get("/api/plans/me").then((res) => res.data);