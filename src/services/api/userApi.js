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
    const response = await axiosInstance.put('/users/profile', profileData);
    return response.data;
  },

  // Update avatar
  updateAvatar: async (file) => {
    const formData = createFormData({ avatar: file });
    const response = await axiosInstance.put('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update cover image
  updateCoverImage: async (file) => {
    const formData = createFormData({ coverImage: file });
    const response = await axiosInstance.put('/users/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Become an author
  becomeAuthor: async () => {
    const response = await axiosInstance.post('/users/become-author');
    return response.data;
  },

  // Get user's books
  getMyBooks: async (params = {}) => {
    const response = await axiosInstance.get('/users/my-books', { params });
    return response.data;
  },

  // Get liked books
  getLikedBooks: async (params = {}) => {
    const response = await axiosInstance.get('/users/liked-books', { params });
    return response.data;
  },

  // Get author stats
  getAuthorStats: async () => {
    const response = await axiosInstance.get('/users/author-stats');
    return response.data;
  },
};

export default userApi;

