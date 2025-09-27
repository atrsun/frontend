'use client'

import axios from "axios";

// Enable debug mode for development
const DEBUG_MODE = process.env.NODE_ENV === "development";

// Base URL from environment variable or default
const API_BASE_URL =
  // process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  process.env.NEXT_PUBLIC_API_URL || "https://holoo.evasence.ir";

if (DEBUG_MODE) {
  console.log("API Base URL:", API_BASE_URL);
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Important: this ensures cookies are sent with requests
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    if (DEBUG_MODE) {
      console.log("API Request:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG_MODE) {
      console.log("API Response:", {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error("API Error:", error.response || error.message);

    if (DEBUG_MODE && error.response) {
      console.log("Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Redirect to login
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  },
);

export default apiClient; 