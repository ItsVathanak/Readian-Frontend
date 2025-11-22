import axiosInstance from './axiosConfig';

const analyticsApi = {
  // Get author analytics
  getAuthorAnalytics: async (params = {}) => {
    const response = await axiosInstance.get('/analytics/author', { params });
    return response.data;
  },

  // Get book analytics
  getBookAnalytics: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/analytics/book/${bookId}`, { params });
    return response.data;
  },

  // Get platform analytics (Admin only)
  getPlatformAnalytics: async (params = {}) => {
    const response = await axiosInstance.get('/analytics/platform', { params });
    return response.data;
  },

  // Get user reading statistics
  getUserReadingStats: async () => {
    const response = await axiosInstance.get('/analytics/reading-stats');
    return response.data;
  },

  // Track reading session
  trackReadingSession: async (chapterId, duration) => {
    const response = await axiosInstance.post('/analytics/track-reading', {
      chapterId,
      duration,
    });
    return response.data;
  },

  // Get trending data
  getTrendingData: async (params = {}) => {
    const response = await axiosInstance.get('/analytics/trending', { params });
    return response.data;
  },
};

export default analyticsApi;

