import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/authContext';
import { subscriptionApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

const SubscriptionManagementPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    if (user) {
      setSubscriptionInfo({
        plan: user.plan || 'free',
        status: user.subscriptionStatus || 'inactive',
        expiresAt: user.subscriptionExpiresAt,
        duration: user.subscriptionDuration
      });
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!subscriptionInfo?.expiresAt) return null;
    const now = new Date();
    const expiry = new Date(subscriptionInfo.expiresAt);
    const diff = expiry - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      setLoading(true);
      await subscriptionApi.cancelSubscription();
      showSuccessToast('Subscription cancelled successfully');
      updateUser({ subscriptionStatus: 'cancelled' });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = (plan) => {
    navigate(`/subscribe?plan=${plan}`);
  };

  const getPlanFeatures = (plan) => {
    const features = {
      free: [
        'Browse kids books',
        'Read free books',
        'Basic profile'
      ],
      basic: [
        'All Free features',
        'Read premium books',
        'Download up to 10 books/month',
        'Ad-free experience'
      ],
      premium: [
        'All Basic features',
        'Unlimited downloads',
        'Advanced search (genre & tags filters)',
        'Early access to new books',
        'Priority support'
      ]
    };
    return features[plan] || [];
  };

  const getPlanPrice = (plan) => {
    const prices = {
      free: 0,
      basic: 4.99,
      premium: 9.99
    };
    return prices[plan] || 0;
  };

  const daysRemaining = getDaysRemaining();
  const currentPlan = subscriptionInfo?.plan || 'free';
  const isActive = subscriptionInfo?.status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Current Subscription Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Subscription Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current Plan */}
            <div className="bg-gradient-to-br from-[#C0FFB3] to-[#00A819] p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Current Plan</h2>
              <p className="text-3xl font-bold text-gray-900 capitalize">{currentPlan}</p>
              <p className="text-sm text-gray-700 mt-1">
                ${getPlanPrice(currentPlan)}/month
              </p>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Status</h2>
              <p className={`text-3xl font-bold capitalize ${
                isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {subscriptionInfo?.status || 'Inactive'}
              </p>
              {isActive && daysRemaining !== null && (
                <p className="text-sm text-gray-700 mt-1">
                  {daysRemaining} days remaining
                </p>
              )}
            </div>
          </div>

          {/* Expiry Date */}
          {isActive && subscriptionInfo?.expiresAt && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Expires on:</span> {formatDate(subscriptionInfo.expiresAt)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {currentPlan === 'free' && (
              <>
                <button
                  onClick={() => handleUpgrade('basic')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upgrade to Basic
                </button>
                <button
                  onClick={() => handleUpgrade('premium')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Upgrade to Premium
                </button>
              </>
            )}

            {currentPlan === 'basic' && (
              <button
                onClick={() => handleUpgrade('premium')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Upgrade to Premium
              </button>
            )}

            {currentPlan !== 'free' && isActive && (
              <button
                onClick={handleCancelSubscription}
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        </div>

        {/* Available Plans */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['free', 'basic', 'premium'].map((plan) => (
            <div
              key={plan}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 ${
                plan === currentPlan ? 'border-green-500' : 'border-gray-200'
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 capitalize mb-2">
                  {plan}
                </h3>
                <p className="text-4xl font-bold text-green-600 mb-1">
                  ${getPlanPrice(plan)}
                </p>
                <p className="text-sm text-gray-500">/month</p>
              </div>

              <ul className="space-y-3 mb-6">
                {getPlanFeatures(plan).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan === currentPlan ? (
                <div className="text-center py-3 bg-green-100 text-green-700 rounded-lg font-semibold">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan === 'free'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {plan === 'free' ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;

