import axiosInstance from './axiosConfig';

const healthApi = {
  // Check API health status
  checkHealth: async () => {
    const response = await axiosInstance.get('/health');
    return response.data;
  },
};

export default healthApi;

