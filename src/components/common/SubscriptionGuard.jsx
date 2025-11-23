import React from 'react';
import { useAuth } from '../../services/auth/authContext';
import { useNavigate } from 'react-router-dom';

/**
 * SubscriptionGuard Component
 * Controls access to books based on subscription tier and book status
 *
 * Access Rules:
 * - Free: Only finished free books
 * - Basic: Only finished books (free + premium)
 * - Premium: All books (ongoing + finished)
 */
const SubscriptionGuard = ({
  children,
  book,
  requireActive = true
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-[#1A5632]">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-gray-700 mb-6">
            Please sign in to read books on Readian.
          </p>
          <button
            onClick={() => navigate('/signin', { state: { from: window.location.pathname } })}
            className="bg-[#1A5632] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a51] transition-all w-full"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const userPlan = user?.plan?.toLowerCase() || 'free';
  const bookStatus = book?.bookStatus?.toLowerCase() || 'finished';
  const isPremiumBook = book?.isPremium || false;

  // Check if subscription is active
  const hasActiveSubscription = user?.subscriptionStatus === 'active';
  const subscriptionExpired = user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) < new Date();

  // If subscription expired, show renewal prompt
  if (requireActive && userPlan !== 'free' && (subscriptionExpired || !hasActiveSubscription)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-yellow-500">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Subscription Expired</h2>
          <p className="text-gray-700 mb-6">
            Your {userPlan.toUpperCase()} subscription has expired.
            Please renew to continue accessing premium content.
          </p>
          {user?.subscriptionExpiresAt && (
            <p className="text-sm text-gray-500 mb-6">
              Expired on: {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
            </p>
          )}
          <button
            onClick={() => navigate('/subscription')}
            className="bg-[#1A5632] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a51] transition-all w-full"
          >
            Renew Subscription
          </button>
        </div>
      </div>
    );
  }

  // FREE TIER - Only finished free books
  if (userPlan === 'free') {
    if (isPremiumBook) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-yellow-500">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-2xl font-bold mb-4">Premium Book</h2>
            <p className="text-gray-700 mb-6">
              This is a premium book. Upgrade to <strong>Basic</strong> or <strong>Premium</strong> to read.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Upgrade Benefits:</h3>
              <ul className="text-sm text-left space-y-1">
                <li>✅ Access to all premium books</li>
                <li>✅ Ad-free reading experience</li>
                <li>✅ Download books as PDF</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all w-full font-bold"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      );
    }

    if (bookStatus === 'ongoing') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-blue-500">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold mb-4">Ongoing Book - Early Access</h2>
            <p className="text-gray-700 mb-6">
              This book is still being written. Upgrade to <strong>Premium</strong> to read chapters as they're released!
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Premium Benefits:</h3>
              <ul className="text-sm text-left space-y-1">
                <li>✅ Early access to ongoing books</li>
                <li>✅ Read new chapters first</li>
                <li>✅ All Basic features included</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all w-full font-bold"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      );
    }
  }

  // BASIC TIER - Only finished books (free + premium)
  if (userPlan === 'basic') {
    if (bookStatus === 'ongoing') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-blue-500">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold mb-4">Ongoing Book - Premium Only</h2>
            <p className="text-gray-700 mb-6">
              This book is still being written. Upgrade to <strong>Premium</strong> for early access!
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Upgrade to Premium:</h3>
              <ul className="text-sm text-left space-y-1">
                <li>✅ Read ongoing books as they're written</li>
                <li>✅ Early access to new chapters</li>
                <li>✅ Support your favorite authors</li>
                <li>✅ Keep all your Basic benefits</li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all w-full font-bold"
            >
              Upgrade to Premium - $9.99/month
            </button>
          </div>
        </div>
      );
    }
  }

  // PREMIUM TIER - Access to all books (no restrictions)
  // User has access, render the content
  return <>{children}</>;
};

export default SubscriptionGuard;

