import axiosInstance from './axiosConfig';
import { createFormData } from '../utils/apiHelpers';

const userApi = {
  // Get user profile by ID
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await axiosInstance.patch('/users/me', profileData);
    return response.data;
  },

  // Update avatar
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.patch('/users/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update cover image
  updateCoverImage: async (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    const response = await axiosInstance.patch('/users/me/cover-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Become an author
  becomeAuthor: async () => {
    const response = await axiosInstance.post('/users/me/become-author');
    return response.data;
  },

  // Get user's books
  getMyBooks: async (params = {}) => {
    const response = await axiosInstance.get('/users/me/books', { params });
    return response.data;
  },

  // Get liked books
  getLikedBooks: async (params = {}) => {
    const response = await axiosInstance.get('/users/me/liked-books', { params });
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosInstance.post('/users/me/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Get all users (Admin only)
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  // Update user by admin
  updateUserByAdmin: async (userId, userData) => {
    const response = await axiosInstance.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  },

  // Get author statistics (for authors only)
  getAuthorStats: async () => {
    const response = await axiosInstance.get('/users/me/author-stats');
    return response.data;
  },
};

export default userApi;

