import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { bookApi, ratingApi, downloadApi } from '../../services/api';
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler';

//truncate
function truncate(str, n) {
    return str?.length > n ? str.substring(0, n-1) + "..." : str;
}

const BookDetail = ({book,signedIn,currentUser}) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLiked, setIsLiked] = useState(book?.likedBy?.includes(currentUser?._id));
  const [localLikes, setLocalLikes] = useState(book?.likes || 0);
  const [localDownloads, setLocalDownloads] = useState(book?.downloadCount || 0);

  // Load user's existing rating on mount
  useEffect(() => {
    const loadUserRating = async () => {
      if (currentUser && book?._id) {
        try {
          const response = await ratingApi.getUserRating(book._id);
          if (response.data?.rating) {
            setUserRating(response.data.rating);
          }
        } catch (error) {
          // User hasn't rated yet, ignore error
          console.log('No existing rating');
        }
      }
    };
    loadUserRating();
  }, [currentUser, book?._id]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!currentUser) {
      alert("Please sign in to leave a like!")
      return;
    }

    try {
      if (isLiked) {
        await bookApi.unlikeBook(book._id);
        setIsLiked(false);
        setLocalLikes(prev => prev - 1);
        showSuccessToast('Unliked book');
      } else {
        await bookApi.likeBook(book._id);
        setIsLiked(true);
        setLocalLikes(prev => prev + 1);
        showSuccessToast('Liked book!');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle rating
  const handleRating = async (rating) => {
    if (!currentUser) {
      alert("Please sign in to rate this book!");
      return;
    }

    try {
      // Send rating in correct format: { rating: value }
      await ratingApi.rateBook(book._id, { rating: rating });
      setUserRating(rating);
      showSuccessToast(`Rated ${rating} stars!`);
      // Note: Average rating will update on next page load
    } catch (error) {
      handleApiError(error);
    }
  };

  // Handle download
  const handleDownload = async () => {
    if (!currentUser) {
      alert("Please sign in to download!");
      return;
    }

    if (!book.allowDownload) {
      alert("Downloads are not allowed for this book");
      return;
    }

    try {
      showSuccessToast('Preparing download...');
      const blob = await downloadApi.downloadBook(book._id);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLocalDownloads(prev => prev + 1);
      showSuccessToast(`${book.title} downloaded successfully!`);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render stars for rating
  const renderStars = (rating, isInteractive = false) => {
    return (
      <div className='flex gap-1'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => isInteractive && handleRating(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            onMouseLeave={() => isInteractive && setHoverRating(0)}
            disabled={!isInteractive}
            className={`text-2xl ${!isInteractive && 'cursor-default'}`}
          >
            {(isInteractive ? (hoverRating || userRating) : rating) >= star ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className='relative w-full max-w-[1200px] mx-4 md:mx-auto bg-white rounded-tr-[50px] md:rounded-tr-[100px] rounded-bl-[50px] md:rounded-bl-[100px] overflow-hidden flex flex-col'>
      {/* Corner Section */}
      <div className='absolute top-0 left-0 bg-[#1A5632] w-[180px] sm:w-[230px] h-[90px] sm:h-[115px] rounded-br-[30px] sm:rounded-br-[50px] flex justify-center items-center z-10'>
        {/* text */}
        <h1 className='bg-none border-2 border-solid border-[#FFD7DF] rounded-[20px] sm:rounded-[30px] h-[32px] sm:h-[40px] px-3 sm:px-5 text-[18px] sm:text-[24px] font-semibold text-[#FFD7DF]'>
          General Info
        </h1>
        {/* top right rectangles */}
        <div
         className='absolute bg-white w-[120px] sm:w-[150px] h-[90px] sm:h-[115px] rounded-tl-[30px] sm:rounded-tl-[50px] z-10 top-0 left-[180px] sm:left-[230px]'
        />
        <div 
           className='absolute bg-[#1A5632] w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] z-0 top-0 left-[180px] sm:left-[230px]'
         />
        {/* bottom left rectangles */}
        <div
           className='absolute bg-white w-[120px] sm:w-[150px] h-[90px] sm:h-[115px] rounded-tl-[30px] sm:rounded-tl-[50px] z-10 top-[90px] sm:top-[115px] left-0'
         />
         <div 
           className='absolute bg-[#1A5632] w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] z-0 top-[90px] sm:top-[115px] left-0'
         />
      </div>

      <div className='flex flex-col lg:flex-row'>
        {/* Left: Cover Image */}
        <div className='w-full self-center lg:w-[350px] h-[400px] sm:h-[450px] lg:h-[500px] flex-shrink-0 mt-[90px] sm:mt-[115px] lg:mt-[50px] lg:ml-8 lg:my-8 z-20'>
          <img
            src={book.image || '/placeholder-book.png'}
            alt={book.title || "Book cover"}
            className='w-full h-full object-cover rounded-lg shadow-lg'
          />

          {/* Quick Stats Below Image on Mobile */}
          <div className='lg:hidden mt-4 p-4 bg-gray-50 rounded-lg'>
            <div className='grid grid-cols-3 gap-3 text-center'>
              <div>
                <p className='text-2xl font-bold text-[#1A5632]'>{book.viewCount || 0}</p>
                <p className='text-xs text-gray-600'>Views</p>
              </div>
              <div>
                <p className='text-2xl font-bold text-[#1A5632]'>{localLikes}</p>
                <p className='text-xs text-gray-600'>Likes</p>
              </div>
              <div>
                <p className='text-2xl font-bold text-[#1A5632]'>{localDownloads}</p>
                <p className='text-xs text-gray-600'>Downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Book Information */}
        <div className='flex-1 mt-[90px] sm:mt-[115px] pt-6 sm:pt-10 md:pt-[50px] px-4 sm:px-8 md:px-[50px] z-20'>
          {/* Title and Author */}
          <div className='mb-6'>
            <h1 className='geist text-[28px] sm:text-[32px] lg:text-[36px] font-bold mb-2 text-[#1A5632]'>
              {book.title || "No Title"}
            </h1>
            <p className='text-[16px] sm:text-[18px] text-gray-700 mb-2'>
              By: <span className='font-semibold'>{typeof book.author === 'object' ? book.author?.name : book.author || "Unknown Author"}</span>
            </p>

            {/* Status Badges */}
            <div className='flex flex-wrap gap-2 mt-3'>
              {book.status === 'published' && (
                <span className='px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full'>
                  Published
                </span>
              )}
              {book.bookStatus && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  book.bookStatus === 'finished' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {book.bookStatus === 'finished' ? 'Completed' : 'Ongoing'}
                </span>
              )}
              {book.isPremium && (
                <span className='px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full'>
                  ⭐ Premium
                </span>
              )}
              {book.contentType && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  book.contentType === 'adult' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {book.contentType === 'adult' ? '🔞 Adult' : '👶 Kids'}
                </span>
              )}
            </div>
          </div>

          {/* Rating Section */}
          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Average Rating</p>
                <div className='flex items-center gap-2'>
                  {renderStars(book.averageRating || 0, false)}
                  <span className='text-xl font-bold text-[#1A5632]'>
                    {(book.averageRating || 0).toFixed(1)}
                  </span>
                  <span className='text-sm text-gray-600'>
                    ({book.totalRatings || 0} ratings)
                  </span>
                </div>
              </div>

              {signedIn && (
                <div>
                  <p className='text-sm text-gray-600 mb-1'>Rate this book</p>
                  {renderStars(userRating, true)}
                </div>
              )}
            </div>
          </div>

          {/* Book Metadata Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6'>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='text-xs text-gray-600 mb-1'>Genre</p>
              <p className='font-semibold text-[#1A5632]'>{book.genre || 'N/A'}</p>
            </div>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='text-xs text-gray-600 mb-1'>Reading Time</p>
              <p className='font-semibold text-[#1A5632]'>{book.readingTime || 'N/A'}</p>
            </div>
            <div className='p-3 bg-gray-50 rounded-lg'>
              <p className='text-xs text-gray-600 mb-1'>Published</p>
              <p className='font-semibold text-[#1A5632] text-sm'>{formatDate(book.publishedDate)}</p>
            </div>
            <div className='p-3 bg-gray-50 rounded-lg hidden lg:block'>
              <p className='text-xs text-gray-600 mb-1'>Views</p>
              <p className='font-semibold text-[#1A5632]'>{book.viewCount || 0}</p>
            </div>
            <div className='p-3 bg-gray-50 rounded-lg hidden lg:block'>
              <p className='text-xs text-gray-600 mb-1'>Likes</p>
              <p className='font-semibold text-[#1A5632]'>{localLikes}</p>
            </div>
            <div className='p-3 bg-gray-50 rounded-lg hidden lg:block'>
              <p className='text-xs text-gray-600 mb-1'>Downloads</p>
              <p className='font-semibold text-[#1A5632]'>{localDownloads}</p>
            </div>
          </div>

          {/* Tags */}
          {book.tags && (
            <div className='mb-6'>
              <p className='text-sm text-gray-600 mb-2'>Tags</p>
              <div className='flex flex-wrap gap-2'>
                {(typeof book.tags === 'string' ? book.tags.split(',') : book.tags).map((tag, index) => (
                  <span key={index} className='px-3 py-1 bg-[#C0FFB3] text-[#1A5632] text-sm rounded-full'>
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-3 my-8'>
            <Link
              to={`/book/${book._id}/chapter/1`}
              className='flex-1 min-w-[200px] text-center py-3 px-6 bg-[#1A5632] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 shadow-md'
            >
              📖 Start Reading
            </Link>

            {signedIn && (
              <>
                <button
                  onClick={handleLike}
                  className={`flex-1 min-w-[150px] py-3 px-6 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 shadow-md ${
                    isLiked
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white text-[#1A5632] border-2 border-[#1A5632] hover:bg-[#1A5632] hover:text-white'
                  }`}
                >
                  {isLiked ? '❤️ Liked' : '🤍 Like'}
                </button>

                {book.allowDownload && (
                  <button
                    onClick={handleDownload}
                    className='flex-1 min-w-[150px] py-3 px-6 bg-white text-[#1A5632] border-2 border-[#1A5632] text-sm sm:text-base font-semibold rounded-lg hover:bg-[#1A5632] hover:text-white transition-all duration-300 shadow-md'
                  >
                    📥 Download
                  </button>
                )}
              </>
            )}

            {!signedIn && (
              <Link
                to="/signin"
                className='flex-1 min-w-[150px] text-center py-3 px-6 bg-white text-[#1A5632] border-2 border-[#1A5632] text-sm sm:text-base font-semibold rounded-lg hover:bg-[#1A5632] hover:text-white transition-all duration-300 shadow-md'
              >
                🔐 Sign In to Like & Download
              </Link>
            )}
          </div>
        </div>
      </div>
      
      
      {/* Description Section */}
      <div className='py-6 sm:py-8 md:py-[50px] px-4 sm:px-8 md:px-16 lg:px-[100px] bg-[#FFD7DF]'>
        <h2 className='geist text-[24px] sm:text-[28px] md:text-[32px] font-bold mb-4 text-[#1A5632]'>
          📚 About This Book
        </h2>
        <p className='text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-line'>
          {book.description || "No description provided for this book yet. Check back later for more details!"}
        </p>

        {/* Additional Info */}
        <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
{/*           <div className='p-4 bg-white rounded-lg'> */}
{/*             <p className='text-xs text-gray-600 mb-1'>Status</p> */}
{/*             <p className='font-semibold text-[#1A5632] capitalize'> */}
{/*               {book.bookStatus || 'N/A'} */}
{/*             </p> */}
{/*           </div> */}
{/*           <div className='p-4 bg-white rounded-lg'> */}
{/*             <p className='text-xs text-gray-600 mb-1'>Content Type</p> */}
{/*             <p className='font-semibold text-[#1A5632] capitalize'> */}
{/*               {book.contentType || 'N/A'} */}
{/*             </p> */}
{/*           </div> */}
{/*           <div className='p-4 bg-white rounded-lg'> */}
{/*             <p className='text-xs text-gray-600 mb-1'>Download Allowed</p> */}
{/*             <p className='font-semibold text-[#1A5632]'> */}
{/*               {book.allowDownload ? '✅ Yes' : '❌ No'} */}
{/*             </p> */}
{/*           </div> */}
        </div>

        {/* Creation/Update Info */}
        <div className='mt-6 pt-6 border-t border-gray-300 text-sm text-gray-600'>
          <div className='flex flex-wrap gap-6'>
            {book.createdAt && (
              <p>
                <span className='font-semibold'>Created:</span> {formatDate(book.createdAt)}
              </p>
            )}
            {book.updatedAt && (
              <p>
                <span className='font-semibold'>Last Updated:</span> {formatDate(book.updatedAt)}
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}

export default BookDetail
