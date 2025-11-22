import React from 'react'
import { Link } from 'react-router-dom'
import Tags from '../landing/Tags';

//truncate text
function truncate(str, n) {
    return str?.length > n ? str.substring(0, n-1) + "..." : str;
}

const BookCard = ({book, linkTo}) => {

// destructure the book and map backend fields to component fields
    const {
        _id,
        title,
        author,
        publishedDate,
        image,
        tags,
        bookStatus,
        description,
        totalChapters,
        viewCount,
        likes
    } = book;

    // defnie linkTo - use _id from backend
    const destination = linkTo || `/book/${_id}`;

    // Handle tags - can be string or array
    const tagsDisplay = Array.isArray(tags)
        ? tags.join(", ")
        : (tags || "No tags provided");

  return (
    <Link 
        to={destination}
        className='flex rounded-[10px] border-solid border-2 w-full max-w-[650px] h-[250px] bg-white overflow-hidden hover:scale-110 transition-all duration-300'
    >
        {image ? (
            <div className='bg-[#CEF17B] w-4/12 h-full rounded-l-[10px]'>
                <img src={image} alt={title || "Book Cover"} className='w-full h-full object-cover ' />
            </div>
        ) : (
            <div className='bg-[#CEF17B] w-4/12 h-full rounded-l-[10px] flex items-center justify-center'>
                <h1 className='text-center'>No Preview</h1>
            </div>
        )}

        {/* details */}
        <div className='flex flex-col p-[20px] w-full justify-between'>
            {/* Top section */}
            <div className='flex justify-between w-full'>
                <div>
                    <h1 
                    className='geist font-semibold text-[28px]'
                    title={title || "Title unavailable"}
                    >
                        {truncate(title,10) || "Title unavailable"}
                    </h1>
                    <p className='text-[12px]'>
                        By {typeof author === 'string' ? author : (author?.name || "Author unavailable")}
                    </p>
                    {book.status === "draft" ? (
                        <p className='text-[16px] text-red-500 font-bold'>
                            (Draft)
                        </p>
                    ): (
                        <></>
                    )}
                </div>
                <p className='text-[10px]'>
                    {publishedDate ? new Date(publishedDate).toLocaleDateString() : "Date unavailable"}
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
                <p className='font-bold text-[16px]'>
                    {bookStatus || "Status unavailable"}
                </p>
                <p 
                className='text-[12px] w-full wrap-break-word line-clamp-2'
                title={description || "No description provided"}
                >
                    {truncate(description, 100) || "No description provided"}
                </p>
            </div>

            {/* Bottom section */}
            <div className='flex gap-[10px]'>
                <p className='text-[10px]'>
                    Chapters: {totalChapters || 0}
                </p>
                <p className='text-[10px]'>
                    Views: {viewCount || 0}
                </p>
                <p className='text-[10px]'>
                    Likes: {likes || 0}
                </p>
            </div>
        </div>


    </Link>
  )
}

export default BookCard
