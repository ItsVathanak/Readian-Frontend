import React, { useState } from 'react';
import { useAuth } from '../../services/auth/authContext';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';

/**
 * AgeGuard Component
 * Protects adult content (18+) based on user's age
 * Shows age verification modal if user is under 18 or age not set
 */
const AgeGuard = ({ children, contentType, bookTitle = 'this book' }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If content is not adult-only, allow access
  if (contentType !== 'adult') {
    return <>{children}</>;
  }

  // If user is not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center border-2 border-red-500">
          <div className="flex justify-center mb-4">
            <Shield size={64} className="text-red-600" />
          </div>
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
          <div className="flex justify-center mb-4">
            <AlertTriangle size={64} className="text-yellow-600" />
          </div>
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
          <div className="flex justify-center mb-4">
            <Shield size={64} className="text-red-600" />
          </div>
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

  // User is 18+, allow direct access without confirmation modal
  return <>{children}</>;
};

export default AgeGuard;

