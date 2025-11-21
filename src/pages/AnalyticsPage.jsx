import React from 'react';
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
import { analyticsData, allBooksData, topAuthorsData } from '../data/mockData';

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <TotalBooks totalBooks={analyticsData.totalBooks} />
          <TotalViews totalViews={analyticsData.totalViews} />
          <PremiumBooks
            premiumCount={analyticsData.premiumBooksCount}
            totalCount={analyticsData.totalBooks}
          />
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Total Users</h3>
            <div className="text-4xl font-bold text-center py-4">{analyticsData.totalUsers}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NewUsersByDay data={analyticsData.newUsersByDay} />
          <UserSubscriptionBreakdown data={analyticsData.subscriptionBreakdown} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UserRoles data={analyticsData.userRoles} />
        </div>

        {/* Tables */}
        <div className="space-y-6">
          <TopBooks books={allBooksData} />
          <TopAuthors authors={topAuthorsData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

