import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { ratingApi } from '../../services/api';
import { useAuth } from '../../services/auth/authContext';
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler';

const StarRating = ({ bookId, averageRating = 0, totalRatings = 0 }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && bookId) {
      fetchUserRating();
    }
  }, [isAuthenticated, bookId]);

  const fetchUserRating = async () => {
    try {
      const response = await ratingApi.getUserRating(bookId);
      if (response.data?.rating) {
        setUserRating(response.data.rating);
        setRating(response.data.rating);
      }
    } catch (error) {
      // User hasn't rated yet, that's ok
      console.log('No user rating found');
    }
  };

  const handleRating = async (value) => {
    if (!isAuthenticated) {
      handleApiError({ message: 'Please login to rate this book' });
      return;
    }

    try {
      setLoading(true);
      await ratingApi.rateBook(bookId, { rating: value });
      setUserRating(value);
      setRating(value);
      showSuccessToast('Rating submitted successfully!');
      // Optionally refresh the page to show updated average
      window.location.reload();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Star Display */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-all ${
              loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
            }`}
            onClick={() => !loading && handleRating(star)}
            onMouseEnter={() => !loading && setHover(star)}
            onMouseLeave={() => !loading && setHover(0)}
            disabled={loading}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hover || rating || userRating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Rating Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-800">
            {averageRating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-gray-500">
            ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
          </span>
        </div>

        {userRating && (
          <span className="text-green-600 font-semibold text-xs sm:text-sm">
            You rated: {userRating} ⭐
          </span>
        )}
      </div>

      {!isAuthenticated && (
        <p className="text-xs text-gray-500 italic">
          Login to rate this book
        </p>
      )}
    </div>
  );
};

export default StarRating;

