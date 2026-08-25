import axiosInstance from "./axiosInstance";

export const searchAddress = (query) =>
  axiosInstance.get("/api/geocode/search", { params: { q: query } }).then((res) => res.data);

export const reverseGeocode = (lat, lon) =>
  axiosInstance.get("/api/geocode/reverse", { params: { lat, lon } }).then((res) => res.data);