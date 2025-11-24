import axiosInstance from './axiosConfig';

const ratingApi = {
  // Rate a book
  rateBook: async (bookId, ratingData) => {
    console.log('🔍 ratingApi.rateBook called with:', { bookId, ratingData });
    console.log('🔍 Type of ratingData:', typeof ratingData);
    console.log('🔍 ratingData keys:', Object.keys(ratingData));

    // Ensure the data is properly formatted
    const payload = {
      rating: ratingData.rating
    };

    console.log('🔍 Final payload being sent:', JSON.stringify(payload));

    const response = await axiosInstance.post(`/books/${bookId}/rate`, payload);
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

