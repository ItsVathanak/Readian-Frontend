import axiosInstance from './axiosConfig';

const subscriptionApi = {
  // Get current user's subscription
  getMySubscription: async () => {
    const response = await axiosInstance.get('/subscriptions/my-subscription');
    return response.data;
  },

  // Get all subscription plans
  getPlans: async () => {
    const response = await axiosInstance.get('/subscriptions/plans');
    return response.data;
  },

  // Subscribe to a plan
  subscribe: async (planId, paymentData) => {
    const response = await axiosInstance.post('/subscriptions/subscribe', {
      planId,
      ...paymentData,
    });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const response = await axiosInstance.post('/subscriptions/cancel');
    return response.data;
  },

  // Renew subscription
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
};

export default subscriptionApi;

