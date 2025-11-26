import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import BookDetail from '../components/bookDetail/BookDetail';
import BookChapters from '../components/bookDetail/BookChapters';
import AuthorCard from '../components/bookDetail/AuthorCard';
import { bookApi } from '../services/api';
import { useAuth } from '../services/auth/authContext';
import { handleApiError } from '../services/utils/errorHandler';

const BookDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookApi.getBookById(id);
        setBook(response.data);
        console.log('Fetched book:', response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book');
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#1A5632] min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="bg-[#1e593e] min-h-svh p-8 text-white text-center text-2xl">
        {error || 'Book not found.'}
      </div>
    );
  }

  // Check age restriction
  if (book.ageRestriction && user) {
    const userAge = user.age || 0;
    if (userAge < book.ageRestriction) {
      return (
        <div className="bg-[#CEF17B] min-h-screen p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Age Restriction</h1>
          <p className="text-xl mb-6">
            This book has an age restriction of {book.ageRestriction}+ years.
            Your current age ({userAge}) does not meet the requirement.
          </p>
          <Link
            to="/browse"
            className="bg-[#FFD7DF] text-[#1A5632] font-bold py-3 px-6 rounded-lg hover:bg-[#1A5632] hover:text-[#FFD7DF] transition-all duration-300"
          >
            Browse Other Books
          </Link>
        </div>
      );
    }
  }

  // Check premium access
  const isPremium = book.isPremium;
  const canSeePremium = user?.role === 'admin' || (
    user?.subscriptionStatus === 'active' &&
    user?.plan === 'premium' &&
    user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );

  if (isPremium && !canSeePremium) {
    return (
      <div className="bg-[#CEF17B] min-h-screen p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl mb-6">
          This content requires an active premium subscription.
        </p>
        <Link 
          to="/subscribe"
          className="bg-[#FFD7DF] text-[#1A5632] font-bold py-3 px-6 rounded-lg hover:bg-[#1A5632] hover:text-[#FFD7DF] transition-all duration-300"
        >
          Subscribe Now
        </Link>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-b from-[#C0FFB3] via-white to-[#FFFDEE] min-h-screen py-8 px-4'>
      <div className='flex flex-col gap-8 max-w-7xl mx-auto'>
        {/* Book Detail - Includes all book info, stats, rating, and download */}
        <BookDetail book={book} signedIn={isAuthenticated} currentUser={user}/>


        {/* Author Card */}
        <AuthorCard
          author={book.author}
          bookCount={book.authorBookCount}
        />

        {/* Book Chapters - Table of Contents */}
        <BookChapters chapterList={book.chapters || []} bookId={book._id || book.id}/>
      </div>
    </div>
  )
}

export default BookDetailPage
