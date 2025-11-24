import React from 'react';
import { Link } from 'react-router-dom';

// truncate text
function truncate(str, n) {
  return str?.length > n ? str.substring(0, n-1) + "..." : str;
}

const AllWorksCard = ({ book, onRemove }) => {
  // Map backend fields to component fields
  const bookId = book.id || book._id;
  const title = book.title;
  const authorName = book.author?.name || book.authorName || "Unknown Author";
  const publishDate = book.publishedDate || book.createdAt;
  const coverImage = book.image || book.cover || book.coverImage;
  const bookTags = book.tags || [];
  const bookStatus = book.bookStatus || book.status || "Unknown";
  const description = book.description || "";
  const totalChapters = book.totalChapters || book.chapters?.length || 0;
  const viewCount = book.viewCount || book.views || 0;
  const likesCount = book.likes || book.totalLikes || book.likesCount || 0;

  // Handle tags - can be array or string
  const tagsDisplay = Array.isArray(bookTags)
    ? bookTags.join(", ")
    : (typeof bookTags === 'string' ? bookTags : "No tags provided");

  return (
    <div className='group relative flex rounded-[10px] border-solid border-2 w-[650px] h-[250px] bg-white overflow-hidden transition-all duration-300'>
      
      {/* --- Hover Overlay --- */}
      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button
          onClick={onRemove}
          className="bg-red-500 text-[#FFD7DF] font-bold py-2 px-8 rounded-lg hover:bg-[#FFD7DF] hover:text-[#FF0000] transition-all duration-300"
        >
          Remove
        </button>
        <Link
          to={`/book/${bookId}`}
          className="bg-white text-black font-bold py-2 px-8 rounded-lg hover:bg-black hover:text-white transition-all duration-300"
        >
          View
        </Link>
      </div>

      {/* --- Original Card Content --- */}
      {/* Image */}
      {coverImage ? (
        <div className='bg-[#CEF17B] w-4/12 h-full rounded-l-[10px]'>
          <img src={coverImage} alt={title || "Book Cover"} className='w-full h-full object-cover' />
        </div>
      ) : (
        <div className='bg-[#CEF17B] w-4/12 h-full rounded-l-[10px] flex items-center justify-center'>
          <h1 className='text-center'>No Preview</h1>
        </div>
      )}

      {/* Details */}
      <div className='flex flex-col p-[20px] w-full justify-between'>
        {/* Top section */}
        <div className='flex justify-between w-full'>
          <div>
            <h1 className='geist font-semibold text-[28px]' title={title || "Title unavailable"}>
              {truncate(title, 10) || "Title unavailable"}
            </h1>
            <p className='text-[12px]'>
              By {authorName}
            </p>
          </div>
          <p className='text-[10px]'>
            {publishDate ? new Date(publishDate).toLocaleDateString() : "N/A"}
          </p>
        </div>

        {/* Tags */}
        <div>
          <p className='text-[16px] font-semibold'>
            Tags: {truncate(tagsDisplay, 100)}
          </p>
        </div>

        {/* Middle section */}
        <div>
          <p className='font-bold text-[16px] capitalize'>{bookStatus}</p>
          <p className='text-[12px] w-[440px] wrap-break-word' title={description || "No description provided"}>
            {truncate(description, 100) || "No description provided"}
          </p>
        </div>

        {/* Bottom section */}
        <div className='flex gap-[10px]'>
          <p className='text-[10px]'>Chapters: {totalChapters}</p>
          <p className='text-[10px]'>Views: {viewCount}</p>
          <p className='text-[10px]'>Likes: {likesCount}</p>
        </div>
      </div>
    </div>
  );
}

export default AllWorksCard;