import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import BookCard from '../browse/BookCard';
import { userApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

function MyWorks() {
  const { user } = useOutletContext();
  const [myWorks, setMyWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setLoading(true);
        const response = await userApi.getMyBooks({ pubStatus: 'published' });
        // Filter to ensure only published books are shown
        const publishedBooks = (response.data.books || []).filter(book =>
          book.status === 'published' || book.pubStatus === 'published'
        );
        setMyWorks(publishedBooks);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col w-full items-center justify-center min-h-[400px]'>
        <div className="text-2xl">Loading your works...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full'>
      <h1 className="geist text-[48px] font-semibold mb-6 self-start">
        My <span className='text-[#00A819]'>Works</span>
      </h1>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 2xl:gap-2 w-full place-items-center">
        {myWorks.length > 0 ? (
          myWorks.map(book => {
            const bookId = book.id || book._id;
            return <BookCard key={bookId} book={book} linkTo={`/edit/${bookId}`}/>
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-600 mb-4">You haven't published any works yet.</p>
            <p className="text-gray-500">Go to "My Drafts" to create a new book!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyWorks;