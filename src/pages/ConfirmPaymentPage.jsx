import React, { useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import PaymentSuccessPopup from '../components/PaymentConfirm/PaymentSuccessPopup';
import { useAuth } from '../services/auth/authContext';
import { subscriptionApi, authApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function ConfirmPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get the plan data from the location state
  const planData = location.state;

  // If no data was passed (e.g., user typed URL directly),
  //    redirect them back to the subscription page.
  if (!planData) {
    return <Navigate to="/subscribe" replace />;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: '/confirm-payment' }} replace />;
  }

  const { planId, planName, price, duration = 30 } = planData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Map planId/planName to the plan type expected by backend
      // planId should be "basic" or "premium"
      let plan = planId;

      // If planId is not "basic" or "premium", try to determine from planName
      if (plan !== 'basic' && plan !== 'premium') {
        plan = planName?.toLowerCase().includes('premium') ? 'premium' : 'basic';
      }

      // Call the backend to activate subscription
      const response = await subscriptionApi.subscribe(plan, duration);

      // Refresh user data from backend to get updated subscription info
      const userResponse = await authApi.getCurrentUser();
      updateUser(userResponse.data);

      showSuccessToast(`${planName} subscription activated successfully!`);
      setShowSuccess(true);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupConfirm = () => {
    // When user clicks "Confirm" on the popup,
    // send them to their profile page.
    setShowSuccess(false);
    navigate('/profile');
  };

  return (
    <div className="max-w-xl mx-auto p-8 my-12 border rounded-lg shadow-lg">

        {/* Render popup if showSuccess is true*/}
        {showSuccess && <PaymentSuccessPopup onConfirm={handlePopupConfirm} />}

      <h1 className="text-3xl font-bold text-center mb-2">
        Confirm Payment for [{planName}] Tier
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        You will be subscribing to the {planName} tier. This subscription can be cancelled at any time. <b>Billing starts on the day of subscription. It will automatically renew each month.</b>
      </p>
      <hr className='mb-4'/>

      <form onSubmit={handleSubmit}>
        {/* Your Information */}
        <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input type="text" placeholder="First Name" className="p-2 border rounded col-span-1" required/>
          <input type="text" placeholder="Middle Name" className="p-2 border rounded col-span-1" />
          <input type="text" placeholder="Last Name" className="p-2 border rounded col-span-1" />
        </div>
        <input type="email" placeholder="Email" defaultValue={user?.email} className="p-2 border rounded w-full mb-4" required/>

        {/* Credit Card Details */}
        <h2 className="text-2xl font-semibold mb-4">Credit Card Details</h2>
        <input type="text" placeholder="Card Number" className="p-2 border rounded w-full mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="MM/YYYY" className="p-2 border rounded" />
          <input type="text" placeholder="Security Code" className="p-2 border rounded" />
        </div>
        <input type="text" placeholder="Cardholder Name" className="p-2 border rounded w-full mb-4" />
        <input type="text" placeholder="Street Address" className='p-2 border rounded w-full mb-4'/>
        <div className='grid grid-cols-2 gap-4 mb-4'>
            <input type="text" placeholder='City' className='p-2 border rounded'/>
            <input type="text" placeholder='Postal Code' className='p-2 border rounded'/>
        </div>
        {/* ... (Address, City, Postal Code) ... */}

        {/* Payment Amount */}
        <p className="text-[24px] font-semibold my-6">
          Amount to be paid: {price}
        </p>

        <button 
          type="submit"
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold"
        >
          Confirm Payment
        </button>
      </form>
    </div>
  );
}

export default ConfirmPaymentPage;