import axiosInstance from './axiosConfig';

const downloadApi = {
  // Download entire book (corrected endpoint)
  downloadBook: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get user's download history
  getDownloadHistory: async (params = {}) => {
    const response = await axiosInstance.get('/downloads/history', { params });
    return response.data;
  },

  // Get download stats (premium users)
  getDownloadStats: async () => {
    const response = await axiosInstance.get('/downloads/stats');
    return response.data;
  },

  // Get author download analytics
  getAuthorDownloadAnalytics: async (params = {}) => {
    const response = await axiosInstance.get('/downloads/analytics', { params });
    return response.data;
  },
};

export default downloadApi;

