import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

function Overview() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalViews: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl">Loading overview...</div>
      </div>
    );
  }

  return (
    <div className=''>
      <h1 className="geist text-5xl font-bold mb-8 text-[#00A819]">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Total Works Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
          <h2 className="text-3xl font-bold text-center mb-4">
            Total <span className="text-[#00A819]">Works</span>
          </h2>
          <p className="text-5xl font-bold text-center">
            {stats.totalBooks > 0 ? stats.totalBooks : "No works"}
          </p>
        </div>

        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
          <h2 className="text-3xl font-bold text-center mb-4">
            Total <span className="text-[#00A819]">Users</span>
          </h2>
          <p className="text-5xl font-bold text-center">
            {stats.totalUsers > 0 ? stats.totalUsers : "No users"}
          </p>
        </div>

        {/* Total Views Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
          <h2 className="text-3xl font-bold text-center mb-4">
            Total <span className="text-[#00A819]">Views</span>
          </h2>
          <p className="text-5xl font-bold text-center">
            {stats.totalViews > 0 ? stats.totalViews.toLocaleString() : "0"}
          </p>
        </div>
      </div>

      {/* Graph Card */}
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
        <h2 className="text-3xl font-bold mb-4">
          Total <span className="text-[#00A819]">Views Overtime</span>
        </h2>
        <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
          <p className="text-gray-500">Graph here</p>
        </div>
      </div>

    </div>
  );
}

export default Overview;