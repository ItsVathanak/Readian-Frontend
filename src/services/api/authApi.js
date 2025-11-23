import axiosInstance from './axiosConfig';

const authApi = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Verify email
  verifyEmail: async (email, code) => {
    const response = await axiosInstance.post('/auth/verify-email', { email, code });
    return response.data;
  },

  // Resend verification code
  resendVerificationCode: async (email) => {
    const response = await axiosInstance.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify reset code
  verifyResetCode: async (email, code) => {
    const response = await axiosInstance.post('/auth/verify-password-reset-code', { email, code });
    return response.data;
  },

  // Reset password
  resetPassword: async (email, code, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },

  // Change password (authenticated user)
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosInstance.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Logout current device
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  // Logout all devices
  logoutAll: async () => {
    const response = await axiosInstance.post('/auth/logout-all-devices');
    return response.data;
  },
};

export default authApi;

