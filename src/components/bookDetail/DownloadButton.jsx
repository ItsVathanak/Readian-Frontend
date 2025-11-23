import React, { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { bookApi } from '../../services/api';
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler';
import { useAuth } from '../../services/auth/authContext';
import { Link } from 'react-router-dom';

const DownloadButton = ({ bookId, bookTitle, isPremium, allowDownload = true }) => {
  const { user, isAuthenticated } = useAuth();
  const [downloading, setDownloading] = useState(false);

  // Check if user can download
  const canDownload = () => {
    if (!isAuthenticated) return false;
    if (!allowDownload) return false;

    // Free users can't download any books (Decision 9B)
    if (!user?.plan || user.plan === 'free') return false;

    // Premium content requires subscription
    if (isPremium && user.subscriptionStatus !== 'active') return false;

    return true;
  };

  const handleDownload = async () => {
    if (!canDownload()) return;

    try {
      setDownloading(true);
      showSuccessToast('Preparing download...');

      const response = await bookApi.downloadBook(bookId);

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle || 'book'}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccessToast('Download started!');
    } catch (error) {
      handleApiError(error);
    } finally {
      setDownloading(false);
    }
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Link
        to="/signin"
        className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
      >
        <Lock className="w-5 h-5" />
        Sign in to Download
      </Link>
    );
  }

  // Free user
  if (!user?.plan || user.plan === 'free') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-semibold">
          <Lock className="w-5 h-5" />
          Download (Premium Feature)
        </div>
        <Link
          to="/subscribe"
          className="text-sm text-blue-600 hover:text-blue-800 text-center underline"
        >
          Upgrade to download books
        </Link>
      </div>
    );
  }

  // Premium book but no active subscription
  if (isPremium && user.subscriptionStatus !== 'active') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-semibold">
          <Lock className="w-5 h-5" />
          Download (Subscription Required)
        </div>
        <Link
          to="/subscribe"
          className="text-sm text-blue-600 hover:text-blue-800 text-center underline"
        >
          Subscribe to download premium books
        </Link>
      </div>
    );
  }

  // Downloads not allowed for this book
  if (!allowDownload) {
    return (
      <div className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed font-semibold">
        <Lock className="w-5 h-5" />
        Download Not Available
      </div>
    );
  }

  // User can download
  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-5 h-5" />
      {downloading ? 'Downloading...' : 'Download PDF'}
    </button>
  );
};

export default DownloadButton;

