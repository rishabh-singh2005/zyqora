import { searchAddress, reverseGeocode } from "../services/geocode.service.js";

// ==================== SEARCH ADDRESS ====================
export const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 3) {
      return res.status(200).json({ success: true, results: [] });
    }

    const results = await searchAddress(q);
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to search address" });
  }
};

// ==================== REVERSE GEOCODE ====================
export const reverse = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ success: false, message: "lat and lon are required" });
    }

    const result = await reverseGeocode(lat, lon);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reverse geocode" });
  }
};

