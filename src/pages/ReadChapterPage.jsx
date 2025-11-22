import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChapterContent from '../components/readChapter/ChapterContent';
import { bookApi, chapterApi } from '../services/api';
import { useAuth } from '../services/auth/authContext';
import { handleApiError } from '../services/utils/errorHandler';

function ReadChapterPage() {
  const { bookId, chapterId } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch book details
        const bookResponse = await bookApi.getBookById(bookId);
        setBook(bookResponse.data);

        // Fetch all chapters
        const chaptersResponse = await bookApi.getBookChapters(bookId);
        setAllChapters(chaptersResponse.data.chapters || []);

        // Fetch specific chapter content
        const chapterResponse = await chapterApi.getChapterById(chapterId);
        setChapter(chapterResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load chapter');
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, chapterId]);

  // Find prev and next chapters
  const currentChapterIndex = allChapters.findIndex(c => c.id === Number(chapterId));
  const prevChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  if (loading) {
    return (
      <div className="bg-[#1A5632] min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading chapter...</div>
      </div>
    );
  }

  if (error || !book || !chapter) {
    return (
      <div className="bg-[#1A5632] min-h-screen p-8 text-white text-center text-2xl">
        {error || 'Chapter not found.'}
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
  const isPremium = book.premiumStatus === 'premium';
  const canSeePremium = user?.role === 'admin' || user?.subscriptionStatus === 'active';

  if (isPremium && !canSeePremium) {
    return (
      <div className="bg-[#CEF17B] min-h-screen p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Premium Content</h1>
        <p className="text-xl mb-6">
          This chapter is only available to premium members.
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

  // Render the chapter content
  return (
    <div className='bg-[#1A5632] flex flex-col items-center py-[100px]'>
        <ChapterContent chapter={chapter} bookId={bookId} book={book} prevChapter={prevChapter} nextChapter={nextChapter}/>
    </div>
  );
}

export default ReadChapterPage;