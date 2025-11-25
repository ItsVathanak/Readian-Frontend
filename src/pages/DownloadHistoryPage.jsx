import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SettingsSidebar from '../components/common/SettingsSidebar';
import { downloadApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function DownloadHistoryPage() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDownloads: 0,
  });

  useEffect(() => {
    fetchDownloads(1);
    fetchStats();
  }, []);

  const fetchDownloads = async (page = 1) => {
    try {
      setLoading(true);
      const response = await downloadApi.getDownloadHistory({ page, limit: 10 });
      setDownloads(response.data.downloads || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const response = await downloadApi.getDownloadStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      handleApiError(error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleRedownload = async (bookId, bookTitle) => {
    try {
      showSuccessToast('Preparing download...');
      const blob = await downloadApi.downloadBook(bookId);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast(`${bookTitle} downloaded successfully!`);
      fetchStats();
    } catch (error) {
      handleApiError(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && pagination.currentPage === 1) {
    return (
      <div className="min-h-screen bg-[#FFFDEE] flex items-center justify-center">
        <div className="text-2xl">Loading download history...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFFDEE]">
      <SettingsSidebar />
      <div className="flex-1 bg-[#FFFDEE] py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A5632] mb-2">
              Download History
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and re-download your previously downloaded books
            </p>
          </div>

          {/* Download Statistics Card */}
          {!loadingStats && stats && (
            <div className="bg-gradient-to-r from-[#C0FFB3] to-[#A0DF93] rounded-lg shadow-lg p-6 mb-8 border-2 border-[#1A5632]">
              <h2 className="text-2xl font-bold text-[#1A5632] mb-4 flex items-center gap-2">
                📊 Download Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Downloads */}
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📥</span>
                    <h3 className="text-sm font-semibold text-gray-600">Total Downloads</h3>
                  </div>
                  <p className="text-3xl font-bold text-[#1A5632]">{stats.totalDownloads || 0}</p>
                </div>

                {/* Downloads Today */}
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📅</span>
                    <h3 className="text-sm font-semibold text-gray-600">Downloads Today</h3>
                  </div>
                  <p className="text-3xl font-bold text-[#00A819]">{stats.downloadsToday || 0}</p>
                </div>

                {/* Downloads This Month */}
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📆</span>
                    <h3 className="text-sm font-semibold text-gray-600">This Month</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.downloadsThisMonth || 0}</p>
                </div>

                {/* Remaining Today */}
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">⏱️</span>
                    <h3 className="text-sm font-semibold text-gray-600">Remaining Today</h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">
                    {stats.remainingToday || 0} <span className="text-lg text-gray-500">/ {stats.dailyLimit || 10}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Downloads List */}
          {downloads.length > 0 ? (
            <div className="space-y-4">
              {downloads.map((download) => (
                <div
                  key={download._id}
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/book/${download.book?._id || download.bookId}`}
                        className="text-lg sm:text-xl font-bold text-[#1A5632] hover:underline block truncate"
                      >
                        {download.book?.title || 'Unknown Book'}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        Downloaded: {formatDate(download.downloadedAt || download.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: PDF • Size: {download.fileSize || 'Unknown'}
                      </p>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <Link
                        to={`/book/${download.book?._id || download.bookId}`}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#C0FFB3] text-[#1A5632] rounded-lg font-semibold hover:bg-[#00A819] hover:text-white transition-all duration-300 text-center"
                      >
                        View Book
                      </Link>
                      <button
                        onClick={() => handleRedownload(download.book?._id || download.bookId, download.book?.title || 'book')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#1A5632] text-white rounded-lg font-semibold hover:bg-[#00A819] transition-all duration-300"
                      >
                        Re-Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📥</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">No Downloads Yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't downloaded any books. Start exploring and download your favorites!
              </p>
              <Link
                to="/browse"
                className="inline-block px-6 py-3 bg-[#1A5632] text-white rounded-lg font-semibold hover:bg-[#00A819] transition-all duration-300"
              >
                Browse Books
              </Link>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => fetchDownloads(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 bg-[#1A5632] text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#00A819] transition-all duration-300"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchDownloads(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 bg-[#1A5632] text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#00A819] transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DownloadHistoryPage;

