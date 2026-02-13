import axios from "axios";
import { authRef } from "./auth";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach auth token to requests
http.interceptors.request.use(async (config) => {
  try {
    const token = await authRef.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // If getAccessToken fails, don't send request without token for protected endpoints
    // Let the request proceed - backend will return 401 if auth is required
    // This allows public endpoints to work even when auth isn't ready
    console.error("Failed to get access token:", error);
  }
  return config;
});

export default http;
