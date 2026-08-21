import axiosInstance from "./axiosInstance";

export const getAddresses = () => axiosInstance.get("/api/addresses").then((res) => res.data);
export const createAddress = (data) => axiosInstance.post("/api/addresses", data).then((res) => res.data);
export const updateAddress = (id, data) => axiosInstance.put(`/api/addresses/${id}`, data).then((res) => res.data);
export const deleteAddress = (id) => axiosInstance.delete(`/api/addresses/${id}`).then((res) => res.data);
export const setDefaultAddress = (id) =>
  axiosInstance.patch(`/api/addresses/${id}/default`).then((res) => res.data);