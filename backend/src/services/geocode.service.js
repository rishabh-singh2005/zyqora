import axios from "axios";

const LOCATIONIQ_BASE = "https://api.locationiq.com/v1";

// ==================== AUTOCOMPLETE SEARCH ====================
export const searchAddress = async (query) => {
  const response = await axios.get(`${LOCATIONIQ_BASE}/autocomplete`, {
    params: {
      key: process.env.LOCATIONIQ_API_KEY,
      q: query,
      limit: 5,
      countrycodes: "in", // restrict to India, adjust/remove if needed
    },
  });

  return response.data.map((item) => ({
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    city: item.address?.city || item.address?.town || item.address?.village || "",
    state: item.address?.state || "",
    postalCode: item.address?.postcode || "",
  }));
};

// ==================== REVERSE GEOCODE (lat/lon -> address) ====================
export const reverseGeocode = async (lat, lon) => {
  const response = await axios.get(`${LOCATIONIQ_BASE}/reverse`, {
    params: {
      key: process.env.LOCATIONIQ_API_KEY,
      lat,
      lon,
      format: "json",
    },
  });

  const item = response.data;
  return {
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    city: item.address?.city || item.address?.town || item.address?.village || "",
    state: item.address?.state || "",
    postalCode: item.address?.postcode || "",
  };
};