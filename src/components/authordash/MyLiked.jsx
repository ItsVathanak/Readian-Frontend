import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import BookCard from '../browse/BookCard';
import { userApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

const MyLiked = () => {
    const { user } = useOutletContext();
    const [likedBooks, setLikedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchLikedBooks = async () => {
        try {
          setLoading(true);
          const response = await userApi.getLikedBooks();
          setLikedBooks(response.data.books || []);
        } catch (error) {
          handleApiError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchLikedBooks();
    }, []);

    if (loading) {
      return (
        <div className='flex flex-col w-full items-center justify-center min-h-[400px]'>
          <div className="text-2xl">Loading liked books...</div>
        </div>
      );
    }

  return (
    <div className='flex flex-col items-center w-full'>
        <h1 className='geist text-[48px] font-semibold mb-6 self-start'>
            <span className='text-[#00A819]'>Liked</span> Works
        </h1>
        {/* display */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 2xl:gap-2 w-full place-items-center">
            {likedBooks.length > 0 ? (
                likedBooks.map(book => {
                  const bookId = book.id || book._id;
                  return <BookCard key={bookId} book={book} />
                })
            ) : (
                <p className='text-[16px] font-semibold'>
                    You haven&quot;t liked any works yet!
                </p>
            )}
        </div>
    </div>
  )
}

export default MyLiked
