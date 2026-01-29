import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// later: attach auth token here
http.interceptors.request.use(config => {
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default http;
