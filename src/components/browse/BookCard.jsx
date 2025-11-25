import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { bookApi } from '../../services/api'
import { useAuth } from '../../services/auth/authContext'
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler'

const BookCard = ({book, linkTo, showLikeButton = false, onLikeChange, disableHoverScale = false}) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [localLikes, setLocalLikes] = useState(book?.likes || book?.totalLikes || book?.likesCount || 0);
    const [isLiked, setIsLiked] = useState(book?.isLikedByUser || false);

// destructure the book and map backend fields to component fields
    const {
        _id,
        id,
        title,
        publishedDate,
        image,
        tags,
        bookStatus,
        description,
        totalChapters,
        viewCount,
        likes,
        totalLikes,
        likesCount,
        isPremium,           // Backend field for premium books
        contentType,         // "kids" or "adult"
        status,              // "draft" or "published"
        author
    } = book;

    // Handle multiple possible like field names
    const displayLikes = localLikes;

    // Handle author name
    const authorName = book.authorName || author?.name || 'Unknown Author';

    // defnie linkTo - use _id or id from backend
    const bookId = _id || id;
    const destination = linkTo || `/book/${bookId}`;

    // Handle tags - can be string or array
    const tagsDisplay = Array.isArray(tags)
        ? tags.join(", ")
        : (tags || "No tags provided");

    // Handle like/unlike
    const handleLikeClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            showSuccessToast('Please sign in to like books');
            navigate('/signin');
            return;
        }

        try {
            if (isLiked) {
                await bookApi.unlikeBook(bookId);
                setIsLiked(false);
                setLocalLikes(prev => prev - 1);
                showSuccessToast('Unliked book');
            } else {
                await bookApi.likeBook(bookId);
                setIsLiked(true);
                setLocalLikes(prev => prev + 1);
                showSuccessToast('Liked book!');
            }

            // Notify parent component of like change
            if (onLikeChange) {
                onLikeChange(bookId, !isLiked);
            }
        } catch (error) {
            handleApiError(error);
        }
    };

  return (
    <div className='group relative flex rounded-[10px] border-solid border-2 w-full max-w-[650px] h-[220px] sm:h-[250px] md:h-[280px] bg-white overflow-hidden hover:scale-105 md:hover:scale-110 transition-all duration-300'>

        {/* Hover Overlay with Like/Unlike button */}
        {showLikeButton && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <button
                    onClick={handleLikeClick}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                        isLiked
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-white text-[#1A5632] hover:bg-[#C0FFB3]'
                    }`}
                >
                    {isLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
                <Link
                    to={destination}
                    className="bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-[#C0FFB3] transition-all duration-300"
                >
                    View Details
                </Link>
            </div>
        )}

        <Link
            to={destination}
            className='flex w-full h-full relative'
        >
        {/* Badges - Top right corner */}
        <div className='absolute top-2 right-2 flex flex-col gap-1 z-10'>
            {isPremium && (
                <span className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1'>
                    <span>👑</span> PREMIUM
                </span>
            )}
            {contentType === 'adult' && (
                <span className='bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg'>
                    🔞 18+
                </span>
            )}
            {bookStatus === 'ongoing' && (
                <span className='bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg'>
                    📖 ONGOING
                </span>
            )}
            {bookStatus === 'finished' && (
                <span className='bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg'>
                    ✅ COMPLETED
                </span>
            )}
            {bookStatus === 'hiatus' && (
                <span className='bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg'>
                    ⏸️ HIATUS
                </span>
            )}
            {status === 'draft' && (
                <span className='bg-gray-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-lg'>
                    ✏️ DRAFT
                </span>
            )}
        </div>

        {image ? (
            <div className='bg-[#CEF17B] w-[35%] sm:w-4/12 h-full rounded-l-[10px] flex-shrink-0'>
                <img src={image} alt={title || "Book Cover"} className='w-full h-full object-cover' />
            </div>
        ) : (
            <div className='bg-[#CEF17B] w-[35%] sm:w-4/12 h-full rounded-l-[10px] flex items-center justify-center flex-shrink-0'>
                <h1 className='text-center text-xs sm:text-sm'>No Preview</h1>
            </div>
        )}

        {/* details */}
        <div className='flex flex-col p-3 sm:p-4 md:p-5 w-full justify-between overflow-hidden'>
            {/* Top section */}
            <div className='flex justify-between w-full gap-2'>
                <div className='flex-1 min-w-0'>
                    <h1
                    className='geist font-semibold text-lg sm:text-xl md:text-2xl truncate'
                    title={title || "Title unavailable"}
                    >
                        {title || "Title unavailable"}
                    </h1>
                    <p className='text-[10px] sm:text-xs truncate'>
                        By {authorName}
                    </p>
                </div>
                <p className='text-[9px] sm:text-[10px] flex-shrink-0 whitespace-nowrap'>
                    {publishedDate ? new Date(publishedDate).toLocaleDateString() : "N/A"}
                </p>
            </div>

            {/* Tags */}
            <div className='overflow-hidden'>
                <p className='text-xs sm:text-sm md:text-base font-semibold truncate'>
                    Tags: {tagsDisplay}
                </p>
            </div>

            {/* Middle section */}
            <div className='overflow-hidden'>
                <p className='font-bold text-sm sm:text-base capitalize'>
                    {bookStatus || "Status unavailable"}
                </p>
                <p 
                className='text-[10px] sm:text-xs w-full line-clamp-2'
                title={description || "No description provided"}
                >
                    {description || "No description provided"}
                </p>
            </div>

            {/* Bottom section */}
            <div className='flex gap-2 sm:gap-3 flex-wrap'>
                <p className='text-[9px] sm:text-[10px]'>
                    Chapters: {totalChapters || 0}
                </p>
                <p className='text-[9px] sm:text-[10px]'>
                    Views: {viewCount || 0}
                </p>
                <p className='text-[9px] sm:text-[10px]'>
                    Likes: {displayLikes}
                </p>
            </div>
        </div>

        </Link>
    </div>
  )
}

export default BookCard
