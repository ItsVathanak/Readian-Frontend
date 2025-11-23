import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { analyticsApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

const Trending = () => {
    const [topBooks, setTopBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopBooks = async () => {
            try {
                setLoading(true);
                const response = await analyticsApi.getPublicAnalytics();
                setTopBooks(response.data.topBooks || []);
            } catch (error) {
                handleApiError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopBooks();
    }, []);

    const displaySlots = Array.from({length: 5}, (_, index) => topBooks[index] || null);

  if (loading) {
    return (
      <div className='bg-[#FFFDEE] min-h-[600px] flex items-center justify-center'>
        <div className="text-2xl">Loading top books...</div>
      </div>
    );
  }

  return (
    <div className='bg-[#FFFDEE] min-h-[600px] px-4 sm:px-8 md:px-16 lg:px-[100px] py-12 flex flex-col gap-[70px]'>
        {/* Trending text */}
        <div>
            <h1 className='geist text-3xl sm:text-4xl md:text-[48px] font-semibold'>
                See <span className='text-[#00A819]'>trending</span> works
            </h1>
        </div>

        {/* Trending stories list */}
        <div className='flex flex-wrap justify-center md:justify-evenly gap-6'>

            {displaySlots.map((book, index) => (
              
              // Check if the slot is a real book or null
              book ? (
                
                // --- It's a REAL BOOK, so make it a Link ---
                <Link 
                  to={`/book/${book._id}`}
                  key={book._id}
                  className='w-[210px] h-[340px] bg-none flex flex-col justify-between hover:scale-110 transition-all duration-300 cursor-pointer relative z-10'
                  style={{ pointerEvents: 'auto' }}
                >
                    {/* cover img */}
                    {book.image ? (
                        <div className='w-full h-[280px] bg-[#CEF17B] rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)]'>
                            <img src={book.image} alt={book.title || "Book cover"} className='w-full h-full object-cover rounded-[20px]'/>
                        </div>
                    ) : (
                        <div className='w-full h-[280px] bg-[#CEF17B] rounded-[20px] shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-center text-center'>
                            Preview unavailable
                        </div>
                    )}
                    <h1 
                      title={book.title || "Title unavailable"}
                      className='text-[20px] font-semibold text-center h-[30px] overflow-hidden'
                    >
                        {book.title || "Title unavailable"}
                    </h1>
                    <div className='text-xs text-center text-gray-600'>
                        👁️ {book.viewCount} | ❤️ {book.totalLikes} | ⭐ {book.averageRating > 0 ? book.averageRating.toFixed(1) : '-'}
                    </div>
                </Link>

              ) : (

                // --- It's an EMPTY SLOT, so make it an unclickable div ---
                <div 
                  key={`slot-${index}`} 
                  className='w-[210px] h-[340px] bg-none flex flex-col justify-between'
                >
                    <div className='w-full h-[280px] bg-gray-200 opacity-50 rounded-[20px] shadow-inner flex items-center justify-center text-center'>
                        Slot Available
                    </div>
                    <h1 
                      className='text-[20px] font-semibold text-center h-[30px] overflow-hidden text-gray-400'
                    >
                        ...
                    </h1>
                </div>

              )
            ))}
        </div>

    </div>
  )
}

export default Trending
