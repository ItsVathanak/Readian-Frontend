import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';
import { Link } from 'react-router-dom';

function AuthorAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAuthorStats();
      setAnalytics(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl">Loading your analytics...</div>
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

  const { stats, topBooks } = analytics;

  return (
    <div className="space-y-8">
      <h1 className="geist text-4xl md:text-5xl font-bold text-[#00A819]">Your Analytics</h1>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Books */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Books</h3>
          <p className="text-4xl font-bold text-green-700">{stats.totalBooks}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Published: {stats.publishedBooks}</div>
            <div>Drafts: {stats.draftBooks}</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Views</h3>
          <p className="text-4xl font-bold text-blue-700">{stats.totalViews.toLocaleString()}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>Chapters: {stats.totalChapters}</div>
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-purple-700">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Likes</h3>
          <p className="text-4xl font-bold text-purple-700">{stats.totalLikes}</p>
          <div className="mt-2 text-xs text-gray-500">
            <div>From all books</div>
          </div>
        </div>
      </div>

      {/* Top Books */}
      {topBooks && topBooks.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-700">
          <h2 className="text-2xl font-bold mb-4 text-[#00A819]">Your Top Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topBooks.map((book) => (
              <Link
                key={book._id}
                to={`/book/${book._id}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Book Cover */}
                <div className="aspect-[2/3] overflow-hidden bg-gray-200">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Cover
                    </div>
                  )}
                </div>

                {/* Book Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span>👁️ {book.viewCount} views</span>
                      <span>❤️ {book.likes} likes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        {book.averageRating > 0
                          ? `⭐ ${book.averageRating.toFixed(1)} (${book.totalRatings})`
                          : '⭐ No ratings'}
                      </span>
                      <span>📥 {book.downloadCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!topBooks || topBooks.length === 0) && (
        <div className="bg-white p-12 rounded-lg shadow-md border-2 border-gray-300 text-center">
          <h3 className="text-2xl font-bold text-gray-600 mb-4">No Published Books Yet</h3>
          <p className="text-gray-500 mb-6">
            Start creating and publishing books to see your analytics here!
          </p>
          <Link
            to="/edit/new"
            className="inline-block bg-[#00A819] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1A5632] transition-colors"
          >
            Create Your First Book
          </Link>
        </div>
      )}
    </div>
  );
}

export default AuthorAnalytics;

