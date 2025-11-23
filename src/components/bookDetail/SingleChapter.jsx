import React from 'react'
import { Link } from 'react-router-dom'

const SingleChapter = ({chapter, bookId, chapterNumber}) => {
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Link
      to={`/book/${bookId}/chapter/${chapter.chapterNumber || chapterNumber}`}
      className='w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white rounded-lg hover:bg-[#C0FFB3] hover:shadow-md transition-all duration-300 group'
    >
      {/* Chapter Number Badge */}
      <div className='flex-shrink-0 w-12 h-12 bg-[#1A5632] text-white rounded-full flex items-center justify-center font-bold group-hover:bg-[#FFD7DF] group-hover:text-[#1A5632] transition-all'>
        {chapterNumber}
      </div>

      {/* Chapter Info */}
      <div className='flex-1 min-w-0'>
        <h3 className='text-base sm:text-lg font-semibold text-[#1A5632] group-hover:underline truncate'>
          {chapter.title || `Chapter ${chapterNumber}`}
        </h3>
        {chapter.description && (
          <p className='text-sm text-gray-600 mt-1 line-clamp-1'>
            {chapter.description}
          </p>
        )}
      </div>

      {/* Chapter Metadata */}
      <div className='flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-sm text-gray-600'>
        {chapter.publishedDate && (
          <span className='text-xs'>
            📅 {formatDate(chapter.publishedDate)}
          </span>
        )}
        {chapter.readingTime && (
          <span className='text-xs'>
            ⏱️ {chapter.readingTime}
          </span>
        )}
        {chapter.wordCount && (
          <span className='text-xs'>
            📝 {chapter.wordCount} words
          </span>
        )}
      </div>

      {/* Arrow Indicator */}
      <div className='hidden sm:block flex-shrink-0 text-[#1A5632] group-hover:translate-x-2 transition-transform'>
        →
      </div>
    </Link>
  )
}

export default SingleChapter
