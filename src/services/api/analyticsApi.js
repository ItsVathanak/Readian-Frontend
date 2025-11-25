import axiosInstance from './axiosConfig';

const analyticsApi = {
  // Get public analytics (for landing page - top books and authors)
  getPublicAnalytics: async () => {
    const response = await axiosInstance.get('/analytics/public');
    return response.data;
  },

  // Get admin analytics (Admin only - comprehensive platform statistics)
  getAdminAnalytics: async () => {
    const response = await axiosInstance.get('/admin/analytics');
    return response.data;
  },

  // Get author download analytics (Author only - their book download statistics)
  getAuthorDownloads: async () => {
    const response = await axiosInstance.get('/author/downloads/analytics');
    return response.data;
  },
};

export default analyticsApi;

