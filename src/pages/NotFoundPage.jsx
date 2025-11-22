import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#C0FFB3] to-[#FFFDEE] p-8">
      <div className="text-center max-w-2xl">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#1A5632] mb-4">
            404
          </h1>
          <div className="h-2 w-32 bg-[#00A819] mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-xl text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
          It might have been moved or deleted.
        </p>

        {/* Book Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-32 w-32 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="bg-[#1A5632] text-[#FFD7DF] px-8 py-3 rounded-full font-semibold hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 border-2 border-[#1A5632]"
          >
            Go to Home
          </Link>

          <Link
            to="/browse"
            className="bg-white text-[#1A5632] px-8 py-3 rounded-full font-semibold hover:bg-[#1A5632] hover:text-white transition-all duration-300 border-2 border-[#1A5632]"
          >
            Browse Books
          </Link>

          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-gray-500">
          <p className="mb-2">Looking for something specific?</p>
          <div className="flex gap-4 justify-center text-sm">
            <Link to="/instruction" className="hover:text-[#00A819] underline">
              Help Center
            </Link>
            <span>•</span>
            <Link to="/browse" className="hover:text-[#00A819] underline">
              All Books
            </Link>
            <span>•</span>
            <Link to="/subscribe" className="hover:text-[#00A819] underline">
              Subscriptions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

