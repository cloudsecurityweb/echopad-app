import axios from "axios";
import { authRef } from "./auth";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// later: attach auth token here
http.interceptors.request.use(async (config) => {
  try {
    const token = await authRef.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get access token:", error);
  }
  return config;
});

export default http;
