import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

function Overview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await analyticsApi.getAdminAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl">Loading overview...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl text-red-500">Failed to load analytics</div>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <h1 className="geist text-4xl md:text-5xl font-bold text-[#00A819]">Platform Overview</h1>

      {/* Top Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-[#00A819]">{analytics.totalUsers}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Admins: {analytics.users.roles.ADMIN || 0}</div>
            <div>Authors: {analytics.users.roles.AUTHOR || 0}</div>
            <div>Readers: {analytics.users.roles.READER || 0}</div>
          </div>
        </div>

        {/* Total Books */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Books</h3>
          <p className="text-4xl font-bold text-blue-700">{analytics.totalBooks}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Published: {analytics.publishedBooks}</div>
            <div>Drafts: {analytics.draftBooks}</div>
            <div>Premium: {analytics.books.premium}</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Views</h3>
          <p className="text-4xl font-bold text-purple-700">{analytics.totalViews.toLocaleString()}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Likes: {analytics.totalLikes}</div>
            <div>Chapters: {analytics.totalChapters}</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Revenue This Month</h3>
          <p className="text-4xl font-bold text-orange-700">${analytics.revenueThisMonth}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Premium: {analytics.premiumSubscribers}</div>
            <div>Basic: {analytics.basicSubscribers}</div>
            <div>Free: {analytics.freeUsers}</div>
          </div>
        </div>

        {/* Total Downloads */}
        {analytics.totalDownloads !== undefined && (
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-pink-700">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Downloads</h3>
            <p className="text-4xl font-bold text-pink-700">{analytics.totalDownloads.toLocaleString()}</p>
            <div className="mt-2 text-xs text-gray-500">
              <div>This Month: {analytics.downloadsThisMonth || 0}</div>
              <div>Books with downloads: {analytics.booksWithDownloads || 0}</div>
            </div>
          </div>
        )}
      </div>

      {/* Top Books */}
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
        <h2 className="text-2xl font-bold mb-4 text-[#00A819]">Top Books</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2 px-4">Book</th>
                <th className="text-left py-2 px-4">Author</th>
                <th className="text-center py-2 px-4">Views</th>
                <th className="text-center py-2 px-4">Likes</th>
                <th className="text-center py-2 px-4">Rating</th>
                <th className="text-center py-2 px-4">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {analytics.detailed.topBooks?.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-xs text-gray-500">{book.genre}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">{book.author.name}</td>
                  <td className="py-3 px-4 text-center">{book.viewCount}</td>
                  <td className="py-3 px-4 text-center">{book.totalLikes}</td>
                  <td className="py-3 px-4 text-center">
                    {book.averageRating > 0 ? `⭐ ${book.averageRating.toFixed(1)}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">{book.downloadCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Authors */}
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-700">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Top Authors</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2 px-4">Author</th>
                <th className="text-center py-2 px-4">Books</th>
                <th className="text-center py-2 px-4">Views</th>
                <th className="text-center py-2 px-4">Likes</th>
                <th className="text-center py-2 px-4">Avg Rating</th>
                <th className="text-center py-2 px-4">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {analytics.detailed.topAuthors?.map((author) => (
                <tr key={author.authorId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {author.authorAvatar && (
                        <img src={author.authorAvatar} alt={author.authorName} className="w-8 h-8 rounded-full" />
                      )}
                      <div>
                        <div className="font-semibold">{author.authorName}</div>
                        <div className="text-xs text-gray-500">{author.authorEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{author.bookCount}</td>
                  <td className="py-3 px-4 text-center">{author.totalViews}</td>
                  <td className="py-3 px-4 text-center">{author.totalLikes}</td>
                  <td className="py-3 px-4 text-center">
                    {author.averageRating > 0 ? `⭐ ${author.averageRating.toFixed(1)}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">{author.totalDownloads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-700">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">User Growth (Last 30 Days)</h2>
        <div className="h-64 overflow-x-auto">
          {analytics.detailed.newUsersLast30Days?.length > 0 ? (
            <div className="flex items-end space-x-2 h-full">
              {analytics.detailed.newUsersLast30Days.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-purple-500 rounded-t"
                    style={{ height: `${(day.count / Math.max(...analytics.detailed.newUsersLast30Days.map(d => d.count))) * 100}%` }}
                    title={`${day.count} users on ${day._id}`}
                  ></div>
                  <div className="text-xs mt-2 transform -rotate-45 origin-top-left">
                    {new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No user growth data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;