import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import BookCard from '../browse/BookCard';
import { userApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

const MyLiked = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        setLoading(true);

        // Fetch liked books - API returns full book objects
        const response = await userApi.getLikedBooks();
        console.log('📚 Liked books response:', response);

        // Extract books array from response
        let books = [];
        if (response.data?.likedBooks) {
          books = response.data.likedBooks;
        } else if (Array.isArray(response.data?.data)) {
          books = response.data.data;
        } else if (Array.isArray(response.data)) {
          books = response.data;
        }

        // Transform books with consistent ID field
        const transformedBooks = books.map(book => ({
          ...book,
          id: book._id || book.id
        }));

        console.log('✅ Liked books:', transformedBooks);
        setLikedBooks(transformedBooks);
      } catch (error) {
        console.error('❌ Error fetching liked books:', error);
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedBooks();
  }, []);

  // Handle when user unlikes a book from the card
  const handleLikeChange = (bookId, isLiked) => {
    if (!isLiked) {
      // Remove the book from the list when unliked
      setLikedBooks(prevBooks => prevBooks.filter(book =>
        (book.id || book._id) !== bookId
      ));
    }
  };

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
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 2xl:gap-2 w-full place-items-center">
        {likedBooks.length > 0 ? (
          likedBooks.map(book => {
            const bookId = book.id || book._id;
            const bookWithLikeStatus = {
              ...book,
              isLikedByUser: true
            };
            return (
              <BookCard
                key={bookId}
                book={bookWithLikeStatus}
                showLikeButton={true}
                onLikeChange={handleLikeChange}
              />
            );
          })
        ) : (
          <p className='text-[16px] font-semibold'>
            You haven't liked any works yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyLiked;

