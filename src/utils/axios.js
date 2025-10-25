// lib/axios.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api-v1/",
  timeout: 10000,
});

// Add token and set headers
axiosInstance.interceptors.request.use(
  (config) => {
    // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const apiKey = import.meta.env.VITE_X_API_KEY || "your-default-api-key";
    // if (token) { config.headers.Authorization = `Bearer ${token}`; }
    config.headers["x-api-key"] = apiKey;

    // Handle FormData headers (don't overwrite it)
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API error:",
      error?.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
