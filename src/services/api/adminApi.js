import axiosInstance from './axiosConfig';

const adminApi = {
  // Get all users (Admin only) - uses /users route with admin role check
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  // Get user by ID (Admin only)
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  // Update user (Admin only) - uses PATCH not PUT
  updateUser: async (userId, userData) => {
    const response = await axiosInstance.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  },

  // Get all books (Admin only) - uses /books route with role check
  getAllBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', { params });
    return response.data;
  },

  // Delete book (Admin only)
  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/admin/books/${bookId}`);
    return response.data;
  },

  // Get admin analytics (comprehensive platform statistics)
  getAnalytics: async () => {
    const response = await axiosInstance.get('/admin/analytics');
    return response.data;
  },
};

export default adminApi;

