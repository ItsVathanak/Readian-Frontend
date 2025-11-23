import axiosInstance from './axiosConfig';

const ratingApi = {
  // Rate a book
  rateBook: async (bookId, ratingData) => {
    const response = await axiosInstance.post(`/books/${bookId}/rate`, ratingData);
    return response.data;
  },

  // Delete rating (backend uses same endpoint with DELETE method)
  deleteRating: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}/rate`);
    return response.data;
  },

  // Get book ratings (all ratings for a book)
  getBookRatings: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/books/${bookId}/ratings`, { params });
    return response.data;
  },

  // Get user's rating for a book
  getUserRating: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}/rating/me`);
    return response.data;
  },
};

export default ratingApi;

