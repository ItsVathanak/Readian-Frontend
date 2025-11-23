import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';
import { handleApiError, showSuccessToast } from '../utils/errorHandler';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Auto-refresh token every 14 minutes (tokens expire in 15 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await authApi.refreshToken({ refreshToken });
          // Backend returns: { data: { tokens: { accessToken, refreshToken } } }
          const { tokens } = response.data;
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = tokens;
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Don't logout user on refresh failure, let them continue
        // They will be logged out when they make next API call with expired token
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  // Listen for logout events from axios interceptor (when tokens expire)
  useEffect(() => {
    const handleAuthLogout = (event) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);

      // Show user-friendly message
      const reason = event.detail?.reason || 'Session expired. Please login again.';
      showSuccessToast(reason);
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const loadUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const response = await authApi.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      showSuccessToast('Registration successful! Please check your email to verify your account.');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      // Backend returns: { data: { user: {...}, tokens: { accessToken, refreshToken } } }
      const { user: userData, tokens } = response.data;
      const { accessToken, refreshToken } = tokens;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      showSuccessToast(`Welcome back, ${userData.name}!`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const logout = async (logoutAll = false) => {
    try {
      if (logoutAll) {
        await authApi.logoutAll();
      } else {
        await authApi.logout();
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);

      showSuccessToast('Logged out successfully');
    } catch (error) {
      // Still clear local state even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
    loadUser,
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 relative">
            <div className="absolute inset-0 border-4 border-[#C0FFB3] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#1A5632] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 bg-[#00A819] rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading Readian...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

