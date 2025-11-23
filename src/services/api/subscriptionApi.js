import axiosInstance from './axiosConfig';

const subscriptionApi = {
  // Get current user's subscription status
  getStatus: async () => {
    const response = await axiosInstance.get('/subscriptions/status');
    return response.data;
  },

  // Subscribe/activate a plan
  activate: async (plan, duration = 30) => {
    const response = await axiosInstance.post('/subscriptions/activate', {
      plan,      // "basic" or "premium"
      duration   // number of days (30, 90, 365)
    });
    return response.data;
  },

  // Legacy alias for activate - accepts object or separate parameters
  subscribe: async (planOrObj, duration = 30) => {
    // Support both calling styles:
    // subscribe({ plan: 'basic', duration: 30 }) OR subscribe('basic', 30)
    const plan = typeof planOrObj === 'object' ? planOrObj.plan : planOrObj;
    const dur = typeof planOrObj === 'object' ? planOrObj.duration : duration;

    const response = await axiosInstance.post('/subscriptions/activate', {
      plan,
      duration: dur
    });
    return response.data;
  },
  renewSubscription: async (paymentData) => {
    const response = await axiosInstance.post('/subscriptions/renew', paymentData);
    return response.data;
  },

  // Get subscription history
  getSubscriptionHistory: async (params = {}) => {
    const response = await axiosInstance.get('/subscriptions/history', { params });
    return response.data;
  },

  // Check subscription status
  checkSubscriptionStatus: async () => {
    const response = await axiosInstance.get('/subscriptions/status');
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await axiosInstance.post('/subscriptions/cancel');
    return response.data;
  },
};

export default subscriptionApi;

