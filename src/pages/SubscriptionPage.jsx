import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionCard from '../components/subscription/SubscriptionCard';
import { useAuth } from '../services/auth/authContext';
import { subscriptionApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function SubscriptionPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch available plans
        const plansResponse = await subscriptionApi.getPlans();
        setPlans(plansResponse.data.plans || []);

        // If user is logged in, fetch their subscription
        if (user) {
          try {
            const subResponse = await subscriptionApi.getMySubscription();
            setSubscription(subResponse.data);
          } catch (_err) {
            // User might not have a subscription
            console.log('No active subscription');
          }
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Unsubscribe handler
  const handleUnsubscribe = async () => {
    if (window.confirm("Are you sure you want to unsubscribe?")) {
      try {
        await subscriptionApi.cancelSubscription();
        setSubscription(null);
        updateUser({ subscriptionStatus: 'inactive' });
        showSuccessToast('Subscription cancelled successfully');
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // This function will be passed to the cards
  const handleSubscribeClick = (plan) => {
    if (!user) {
      navigate('/signin', { state: { from: '/subscribe' } });
      return;
    }

    // Navigate to the payment page, passing plan data in 'state'
    navigate('/confirm-payment', { 
      state: { 
        planId: plan.id,
        planName: plan.name,
        price: plan.price 
      } 
    });
  };

  if (loading) {
    return (
      <div className="bg-[#FFFDEE] min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading plans...</div>
      </div>
    );
  }

  if (user?.subscriptionStatus === 'active' && subscription) {
    const currentPlan = plans.find(p => p.id === subscription.planId);

    // --- RENDER THE "SUBSCRIBED" VIEW ---
    return (
      <div className="bg-[#FFFDEE] min-h-screen p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-12">
          Your current subscription: {currentPlan?.name || 'Premium'}
        </h1>
        
        {/* Display their current plan benefits */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Your Benefits:</h2>
          {currentPlan?.features && (
            <ul className="list-disc list-inside space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          )}

          {subscription.endDate && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-gray-600">
                Expires: {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Unsubscribe Button */}
        <button 
          onClick={handleUnsubscribe}
          className="mt-8 bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600"
        >
          Cancel Subscription
        </button>
      </div>
    );

  } else {
    
    // --- RENDER THE "NOT SUBSCRIBED" (CHOOSE PLAN) VIEW ---
    return (
      <div className="bg-[#FFFDEE] min-h-screen p-8 flex flex-col items-center">
        <h1 className="geist text-4xl font-bold mb-12">Choose Your Plan</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {plans.map((plan) => (
            <SubscriptionCard 
              key={plan.name}
              plan={plan}
              onSubscribe={!plan.isDefault ? () => handleSubscribeClick(plan) : null}
            />
          ))}
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-12 bg-[#1A5632] text-[#FFD7DF] py-4 px-10 rounded-full font-semibold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300" 
        >
          Back To Home
        </button>
      </div>
    );
  }


  // return (
  //   <div className="bg-[#FFFDEE] min-h-screen p-8 flex flex-col items-center">
  //     <h1 className="text-4xl font-bold mb-12">Choose Your Plan</h1>
      
  //     {/* 3-Card Container */}
  //     <div className="flex flex-col md:flex-row gap-8">
  //       {plans.map((plan) => (
  //         <SubscriptionCard 
  //           key={plan.name}
  //           plan={plan}
  //           // Pass the handler down, only if it's not the default plan
  //           onSubscribe={!plan.isDefault ? () => handleSubscribeClick(plan) : null}
  //         />
  //       ))}
  //     </div>

  //     {/* Back to Home Button */}
  //     <button 
  //       onClick={() => navigate('/')}
  //       className="mt-12 bg-gray-800 text-white py-3 px-8 rounded-full font-semibold"
  //     >
  //       Back To Home
  //     </button>
  //   </div>
  // );
}

export default SubscriptionPage;