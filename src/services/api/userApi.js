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
    console.log('📚 getMyBooks raw response:', response.data);

    // Handle response structure - could be direct array or wrapped in books property
    let books = [];
    if (response.data.data?.books) {
      books = response.data.data.books;
    } else if (Array.isArray(response.data.data)) {
      books = response.data.data;
    } else if (response.data.books) {
      books = response.data.books;
    }

    // Transform _id to id for consistency
    books = books.map(book => ({
      ...book,
      id: book._id || book.id
    }));

    const result = {
      ...response.data,
      data: {
        books,
        pagination: response.data.pagination || response.data.data?.pagination || {}
      }
    };

    console.log('✅ getMyBooks transformed result:', result);
    return result;
  },

  // Get liked books
  getLikedBooks: async (params = {}) => {
    const response = await axiosInstance.get('/users/me/liked-books', { params });
    console.log('❤️ getLikedBooks raw response:', response.data);

    // Handle response structure
    let books = [];
    if (response.data.data?.books) {
      books = response.data.data.books;
    } else if (Array.isArray(response.data.data)) {
      books = response.data.data;
    } else if (response.data.books) {
      books = response.data.books;
    }

    // Transform _id to id
    books = books.map(book => ({
      ...book,
      id: book._id || book.id
    }));

    const result = {
      ...response.data,
      data: {
        books,
        pagination: response.data.pagination || response.data.data?.pagination || {}
      }
    };

    console.log('✅ getLikedBooks transformed result:', result);
    return result;
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

