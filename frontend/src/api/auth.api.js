import axiosInstance from "./axiosInstance";

export const signupUser = (data) => axiosInstance.post("/api/auth/signup", data).then((res) => res.data);
export const loginUser = (data) => axiosInstance.post("/api/auth/login", data).then((res) => res.data);
export const logoutUser = () => axiosInstance.post("/api/auth/logout").then((res) => res.data);
export const resendVerificationEmail = (data) => axiosInstance.post("/api/auth/resend-verification", data).then((res) => res.data);