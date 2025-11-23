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
};

export default analyticsApi;

