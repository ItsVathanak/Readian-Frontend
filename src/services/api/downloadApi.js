import axiosInstance from './axiosConfig';

const downloadApi = {
  // Download a chapter
  downloadChapter: async (chapterId) => {
    const response = await axiosInstance.get(`/downloads/chapter/${chapterId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download entire book
  downloadBook: async (bookId) => {
    const response = await axiosInstance.get(`/downloads/book/${bookId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get user's download history
  getDownloadHistory: async (params = {}) => {
    const response = await axiosInstance.get('/downloads/history', { params });
    return response.data;
  },

  // Check download eligibility
  checkDownloadEligibility: async (chapterId) => {
    const response = await axiosInstance.get(`/downloads/check/${chapterId}`);
    return response.data;
  },
};

export default downloadApi;

