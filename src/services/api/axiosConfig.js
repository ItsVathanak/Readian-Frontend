import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
  timeout: 30000,
});

// Public routes that don't need authentication
const PUBLIC_ROUTES = [
  '/auth/register',
  '/auth/login',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/forgot-password',
  '/auth/verify-password-reset-code',
  '/auth/reset-password',
  '/auth/refresh-token',
];

// Check if a URL is a public route
const isPublicRoute = (url) => {
  return PUBLIC_ROUTES.some(route => url.includes(route));
};

// Request interceptor - Add auth token to requests (except public routes)
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't add token to public routes
    if (!isPublicRoute(config.url)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        // If no refresh token, don't try to refresh
        if (!refreshToken) {
          return Promise.reject(error);
        }

        // Attempt to refresh token silently in background
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Backend returns: { success: true, data: { tokens: { accessToken, refreshToken } } }
        const { tokens } = response.data.data;
        const { accessToken, refreshToken: newRefreshToken } = tokens;

        // Save new tokens
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Only logout if refresh token is actually invalid (401 or 403)
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          // Tokens are truly invalid - logout required
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          // Dispatch custom event for graceful logout (instead of hard redirect)
          window.dispatchEvent(new CustomEvent('auth:logout', {
            detail: { reason: 'Session expired. Please login again.' }
          }));
        }
        // For other errors (network, server down, etc), just reject without logout
        return Promise.reject(refreshError);
      }
    }

    // Format error response for user-friendly messages
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.data?.code,
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(formattedError);
  }
);

export default axiosInstance;

