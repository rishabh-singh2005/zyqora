import axiosInstance from "./axiosInstance";

const getClientOrigin = () => {
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }
  return undefined;
};

export const signupUser = (data) =>
  axiosInstance
    .post("/api/auth/signup", { clientUrl: getClientOrigin(), ...data })
    .then((res) => res.data);

export const loginUser = (data) =>
  axiosInstance
    .post("/api/auth/login", { clientUrl: getClientOrigin(), ...data })
    .then((res) => res.data);

export const logoutUser = () =>
  axiosInstance.post("/api/auth/logout").then((res) => res.data);

export const resendVerificationEmail = (data) =>
  axiosInstance
    .post("/api/auth/resend-verification", { clientUrl: getClientOrigin(), ...data })
    .then((res) => res.data);