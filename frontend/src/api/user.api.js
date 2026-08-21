import axiosInstance from "./axiosInstance";

export const getProfile = () => axiosInstance.get("/api/users/me").then((res) => res.data);
export const updateProfile = (data) => axiosInstance.put("/api/users/me", data).then((res) => res.data);
export const uploadAvatar = (formData) =>
  axiosInstance
    .post("/api/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
export const downloadProfilePDF = () =>
  axiosInstance.get("/api/users/me/download", { responseType: "blob" });