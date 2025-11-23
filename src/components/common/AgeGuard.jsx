import React, { useState } from 'react';
import { useAuth } from '../../services/auth/authContext';
import { useNavigate } from 'react-router-dom';

/**
 * AgeGuard Component
 * Protects adult content (18+) based on user's age
 * Shows age verification modal if user is under 18 or age not set
 */
const AgeGuard = ({ children, contentType, bookTitle = 'this book' }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // If content is not adult-only, allow access
  if (contentType !== 'adult') {
    return <>{children}</>;
  }

  // If user is not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-red-500">
          <div className="text-6xl mb-4">🔞</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Age Restricted Content</h2>
          <p className="text-gray-700 mb-6">
            You must be signed in and 18 years or older to access this content.
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

  // Check if user has age set
  if (!user?.age) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-yellow-500">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Age Verification Required</h2>
          <p className="text-gray-700 mb-6">
            To access adult content, please add your age to your profile.
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="bg-[#1A5632] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a51] transition-all w-full"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  // Check if user is 18 or older
  if (user.age < 18) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-red-500">
          <div className="text-6xl mb-4">🔞</div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
          <p className="text-gray-700 mb-6">
            You must be 18 years or older to access this content.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Your age: {user.age} years old
            </span>
          </p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-[#1A5632] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a51] transition-all w-full"
          >
            Browse Other Books
          </button>
        </div>
      </div>
    );
  }

  // User is 18+, show confirmation modal on first access
  if (!showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🔞</div>
          <h2 className="text-2xl font-bold mb-4">Adult Content Warning</h2>
          <p className="text-gray-700 mb-6">
            {bookTitle} contains adult content that may not be suitable for all audiences.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-[#1A5632] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a51] transition-all"
            >
              I'm 18+, Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User confirmed age, show content
  return <>{children}</>;
};

export default AgeGuard;

