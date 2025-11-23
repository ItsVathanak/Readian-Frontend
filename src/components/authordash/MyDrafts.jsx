import React, { useState, useEffect } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import BookCard from '../browse/BookCard';
import { userApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';

const MyDrafts = () => {
    const { user } = useOutletContext();
    const [myDrafts, setMyDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchDrafts = async () => {
        try {
          setLoading(true);
          const response = await userApi.getMyBooks({ pubStatus: 'draft' });
          setMyDrafts(response.data.books || []);
        } catch (error) {
          handleApiError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchDrafts();
    }, []);

    if (loading) {
      return (
        <div className='flex flex-col w-full items-center justify-center min-h-[400px]'>
          <div className="text-2xl">Loading drafts...</div>
        </div>
      );
    }

  return (
    <div className='flex flex-col items-center w-full'>
        {/* Top */}
        <div className='mb-6 flex flex-col gap-6 self-start'>
            <h1 className='geist text-[48px] font-semibold'>
                My <span className='text-[#00A819]'>Drafts</span>
            </h1>

            {/* Create button */}
            <Link to={`/edit/new`} className='bg-[#1A5632] rounded-full text-[#FFD7DF] text-[18px] text-center py-2 w-[200px] flex-initial hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300'>
            Create New
            </Link>
        </div>

        {/* display */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 2xl:gap-2 w-full place-items-center">
        {myDrafts.length > 0 ? (
          myDrafts.map(book => <BookCard key={book._id || book.id} book={book} linkTo={`/edit/${book._id || book.id}`} />)
        ) : (
          <p className="text-lg text-gray-600">You have no drafts. Create a new book to get started!</p>
        )}
      </div>
    </div>
  )
}

export default MyDrafts
