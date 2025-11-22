import axiosInstance from './axiosConfig';

const ratingApi = {
  // Rate a book
  rateBook: async (bookId, rating, review) => {
    const response = await axiosInstance.post(`/ratings/${bookId}`, {
      rating,
      review,
    });
    return response.data;
  },

  // Update rating
  updateRating: async (bookId, rating, review) => {
    const response = await axiosInstance.put(`/ratings/${bookId}`, {
      rating,
      review,
    });
    return response.data;
  },

  // Delete rating
  deleteRating: async (bookId) => {
    const response = await axiosInstance.delete(`/ratings/${bookId}`);
    return response.data;
  },

  // Get book ratings
  getBookRatings: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/ratings/${bookId}`, { params });
    return response.data;
  },

  // Get user's rating for a book
  getUserRating: async (bookId) => {
    const response = await axiosInstance.get(`/ratings/${bookId}/my-rating`);
    return response.data;
  },

  // Get all ratings by user
  getUserRatings: async (params = {}) => {
    const response = await axiosInstance.get('/ratings/my-ratings', { params });
    return response.data;
  },
};

export default ratingApi;

