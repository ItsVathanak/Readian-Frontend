import React from 'react'
import { Link } from 'react-router-dom'

const BookCard = ({book, linkTo}) => {

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
    const displayLikes = likes || totalLikes || likesCount || 0;

    // Handle author name
    const authorName = book.authorName || author?.name || 'Unknown Author';

    // defnie linkTo - use _id or id from backend
    const bookId = _id || id;
    const destination = linkTo || `/book/${bookId}`;

    // Handle tags - can be string or array
    const tagsDisplay = Array.isArray(tags)
        ? tags.join(", ")
        : (tags || "No tags provided");

  return (
    <Link 
        to={destination}
        className='flex rounded-[10px] border-solid border-2 w-full max-w-[650px] h-[220px] sm:h-[250px] md:h-[280px] bg-white overflow-hidden hover:scale-105 md:hover:scale-110 transition-all duration-300 relative'
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
  )
}

export default BookCard
