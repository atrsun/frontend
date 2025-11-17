import axios, { InternalAxiosRequestConfig } from "axios";
import { getSession } from "@/lib/session";

// Extend the AxiosRequestConfig type
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

// Enable debug mode for development
const DEBUG_MODE = process.env.NODE_ENV === "development";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: "https://api.atrsun.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    try {
      // Skip authorization if skipAuth is set to true in request config
      if (config.skipAuth !== true) {
        // Get the session to access the token
        const session = await getSession();
        
        if (session?.token) {
          config.headers.Authorization = `Bearer ${session.token}`;
        }
      }

      // Add X-API-KEY header if available
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (apiKey) {
        config.headers["X-API-KEY"] = apiKey;
      }
    } catch (error) {
      console.error("Error getting session token:", error);
    }

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

    // Handle specific error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          window.location.href = "/auth";
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden");
          break;
        case 429:
          // Too Many Requests
          console.error("Rate limit exceeded");
          break;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;

// Usage examples:
// 
// Regular API call (with auth token):
// apiClient.get('/some-endpoint')
//
// API call without auth token:
// apiClient.get('/public-endpoint', { skipAuth: true })
