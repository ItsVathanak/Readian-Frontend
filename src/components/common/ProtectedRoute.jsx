import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/auth/authContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE] p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-xl mb-6">
            You don't have permission to access this page.
          </p>
          <a
            href="/browse"
            className="bg-[#1A5632] text-white px-6 py-3 rounded-lg hover:bg-[#2d7a51] transition-all"
          >
            Go to Browse
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

