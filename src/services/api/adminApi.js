import axiosInstance from './axiosConfig';

const adminApi = {
  // Get all users (Admin only)
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID (Admin only)
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Ban user (Admin only)
  banUser: async (userId, reason) => {
    const response = await axiosInstance.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  },

  // Unban user (Admin only)
  unbanUser: async (userId) => {
    const response = await axiosInstance.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  // Get all books (Admin only)
  getAllBooks: async (params = {}) => {
    const response = await axiosInstance.get('/admin/books', { params });
    return response.data;
  },

  // Delete book (Admin only)
  deleteBook: async (bookId, reason) => {
    const response = await axiosInstance.delete(`/admin/books/${bookId}`, {
      data: { reason },
    });
    return response.data;
  },

  // Get platform statistics (Admin only)
  getPlatformStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  // Get reported content (Admin only)
  getReportedContent: async (params = {}) => {
    const response = await axiosInstance.get('/admin/reports', { params });
    return response.data;
  },

  // Resolve report (Admin only)
  resolveReport: async (reportId, action) => {
    const response = await axiosInstance.post(`/admin/reports/${reportId}/resolve`, {
      action,
    });
    return response.data;
  },
};

export default adminApi;

