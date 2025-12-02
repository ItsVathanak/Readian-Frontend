import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsApi } from '../../services/api';
import { handleApiError } from '../../services/utils/errorHandler';
import { Eye, Heart, Star } from 'lucide-react';

const TopAuthors = () => {
  const [topAuthors, setTopAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopAuthors = async () => {
      try {
        setLoading(true);
        const response = await analyticsApi.getPublicAnalytics();
        setTopAuthors(response.data.topAuthors || []);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAuthors();
  }, []);

  if (loading) {
    return (
      <div className='bg-white min-h-[400px] flex items-center justify-center'>
        <div className="text-2xl">Loading top authors...</div>
      </div>
    );
  }

  if (topAuthors.length === 0) {
    return null;
  }

  return (
    <div className='bg-[#FFFDEE] min-h-[400px] px-4 sm:px-8 md:px-16 lg:px-[100px] py-12 flex flex-col gap-8'>
      {/* Header */}
      <div>
        <h1 className='geist text-3xl sm:text-4xl md:text-[48px] font-semibold'>
          Top <span className='text-[#00A819]'>Authors</span>
        </h1>
        <p className='text-gray-600 mt-2'>Discover the most popular writers on our platform</p>
      </div>

      {/* Authors Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
        {topAuthors.map((author) => (
          <div
            key={author.authorId}
            className='bg-[#C0FFB3] rounded-xl p-6 flex flex-col items-center gap-4 hover:scale-105 transition-all duration-300 shadow-lg'
          >
            {/* Avatar */}
            <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-200'>
              {author.authorAvatar ? (
                <img
                  src={author.authorAvatar}
                  alt={author.authorName}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500'>
                  {author.authorName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className='text-center'>
              <h3 className='font-bold text-lg'>{author.authorName}</h3>
              <p className='text-sm text-gray-600'>{author.bookCount} {author.bookCount === 1 ? 'book' : 'books'}</p>
            </div>

            {/* Stats */}
            <div className='w-full flex flex-col gap-2 text-sm'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 flex items-center gap-1'>
                  <Eye size={14} /> Views:
                </span>
                <span className='font-semibold'>{author.totalViews.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 flex items-center gap-1'>
                  <Heart size={14} /> Likes:
                </span>
                <span className='font-semibold'>{author.totalLikes.toLocaleString()}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-700 flex items-center gap-1'>
                  <Star size={14} /> Rating:
                </span>
                <span className='font-semibold'>
                  {author.averageRating > 0 ? author.averageRating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>

{/*              */}{/* View Profile Button */}
{/*             <Link */}
{/*               to={`/profile/${author.authorId}`} */}
{/*               className='mt-2 px-4 py-2 bg-[#1A5632] text-[#FFD7DF] rounded-lg hover:bg-[#FFD7DF] hover:text-[#1A5632] transition-all duration-300 text-sm font-semibold' */}
{/*             > */}
{/*               View Profile */}
{/*             </Link> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAuthors;

