import React, { useState, useEffect } from 'react';
import {
  TopBooks,
  TopAuthors,
  TotalBooks,
  TotalViews,
  PremiumBooks,
  UserRoles,
  NewUsersByDay,
  UserSubscriptionBreakdown
} from '../components/admin/analytics';
import { analyticsApi } from '../services/api';
import { handleApiError } from '../services/utils/errorHandler';
import { useAuth } from '../services/auth/authContext';

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Fetch based on user role
        let response;
        if (user?.role === 'admin') {
          response = await analyticsApi.getPlatformAnalytics();
        } else if (user?.role === 'author') {
          response = await analyticsApi.getAuthorAnalytics();
        }
        setAnalytics(response?.data || {});
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">No analytics data available</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TotalBooks totalBooks={analytics.totalBooks || 0} />
          <TotalViews totalViews={analytics.totalViews || 0} />
          <PremiumBooks
            premiumCount={analytics.premiumBooksCount || 0}
            totalCount={analytics.totalBooks || 0}
          />
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Total Users</h3>
            <div className="text-4xl font-bold text-center py-4">{analytics.totalUsers || 0}</div>
          </div>
        </div>

        {/* Charts */}
        {analytics.newUsersByDay && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <NewUsersByDay data={analytics.newUsersByDay} />
            {analytics.subscriptionBreakdown && (
              <UserSubscriptionBreakdown data={analytics.subscriptionBreakdown} />
            )}
          </div>
        )}

        {analytics.userRoles && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <UserRoles data={analytics.userRoles} />
          </div>
        )}

        {/* Tables */}
        <div className="space-y-6">
          {analytics.topBooks && <TopBooks books={analytics.topBooks} />}
          {analytics.topAuthors && <TopAuthors authors={analytics.topAuthors} />}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

