import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SubscriptionCard from '../components/subscription/SubscriptionCard';
import { useAuth } from '../services/auth/authContext';
import { subscriptionApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function SubscriptionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Get pre-selected plan from URL
  const preSelectedPlan = searchParams.get('plan') || null;

  const [selectedPlan, setSelectedPlan] = useState(preSelectedPlan || 'basic');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [processing, setProcessing] = useState(false);

  // Plan features and pricing
  const plans = {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Browse kids books',
        'Read free books',
        'Basic profile'
      ]
    },
    basic: {
      name: 'Basic',
      basePrice: 4.99,
      features: [
        'All Free features',
        'Read premium books',
        'Download up to 10 books/month',
        'Ad-free experience'
      ]
    },
    premium: {
      name: 'Premium',
      basePrice: 9.99,
      features: [
        'All Basic features',
        'Unlimited downloads',
        'Advanced search (genre & tags filters)',
        'Early access to new books',
        'Priority support'
      ]
    }
  };

  // Duration pricing (with discounts for longer durations)
  const getDurationPrice = (basePrice, duration) => {
    if (duration === 30) return basePrice;
    if (duration === 90) return basePrice * 2.5; // ~17% discount
    if (duration === 365) return basePrice * 8; // ~33% discount
    return basePrice;
  };

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signin', { state: { from: `/subscribe?plan=${selectedPlan}` } });
      return;
    }

    if (selectedPlan === 'free') {
      showSuccessToast('You are already on the free plan');
      return;
    }

    setProcessing(true);
    try {
      // Call subscription API
      const response = await subscriptionApi.subscribe({
        plan: selectedPlan,
        duration: selectedDuration
      });

      showSuccessToast(`Successfully subscribed to ${plans[selectedPlan].name}!`);

      // Redirect to management page or home
      setTimeout(() => {
        navigate('/subscription/manage');
      }, 1500);
    } catch (error) {
      handleApiError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Select the plan that best fits your reading needs. Upgrade or downgrade anytime.
        </p>

        {/* Plan Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              onClick={() => key !== 'free' && setSelectedPlan(key)}
              className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all duration-300 ${
                selectedPlan === key
                  ? 'ring-4 ring-green-500 scale-105'
                  : 'hover:shadow-2xl hover:scale-102'
              } ${key === 'premium' ? 'md:scale-105' : ''}`}
            >
              {key === 'premium' && (
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-bold py-1 px-4 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>

              {key !== 'free' ? (
                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-600">
                    ${plan.basePrice}
                  </span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              ) : (
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-600">Free</span>
                </div>
              )}

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
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

              {key === selectedPlan && key !== 'free' && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3">
                  <p className="text-sm font-semibold text-green-700 text-center">
                    ✓ Selected
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Duration Selection (Only shown if not free plan) */}
        {selectedPlan !== 'free' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Select Duration
            </h3>

            <div className="space-y-4">
              {[30, 90, 365].map((duration) => {
                const price = getDurationPrice(plans[selectedPlan].basePrice, duration);
                const monthlyPrice = (price / (duration / 30)).toFixed(2);
                const savings = duration > 30
                  ? `Save $${(plans[selectedPlan].basePrice * (duration / 30) - price).toFixed(2)}`
                  : null;

                return (
                  <label
                    key={duration}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDuration === duration
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="duration"
                        value={duration}
                        checked={selectedDuration === duration}
                        onChange={() => setSelectedDuration(duration)}
                        className="w-5 h-5 text-green-600"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {duration} days
                          {savings && (
                            <span className="ml-2 text-sm text-green-600 font-bold">
                              {savings}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${monthlyPrice}/month
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        ${price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
          >
            Back to Home
          </button>

          {selectedPlan !== 'free' && (
            <button
              onClick={handleSubscribe}
              disabled={processing}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Subscribe to ${plans[selectedPlan].name}`}
            </button>
          )}

          {user?.subscriptionStatus === 'active' && (
            <button
              onClick={() => navigate('/subscription/manage')}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;