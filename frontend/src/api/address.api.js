import axiosInstance from "./axiosInstance";

export const getAddresses = () => axiosInstance.get("/api/addresses").then((res) => res.data);