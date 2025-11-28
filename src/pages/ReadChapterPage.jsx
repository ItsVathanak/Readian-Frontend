import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChapterContent from '../components/readChapter/ChapterContent';
import ChapterNavigation from '../components/readChapter/ChapterNavigation';
import { bookApi } from '../services/api';
import { handleApiError } from '../services/utils/errorHandler';
import SubscriptionGuard from '../components/common/SubscriptionGuard';

function ReadChapterPage() {
  const { bookId, chapterNumber } = useParams();
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

        // Fetch all chapters list
        const chaptersResponse = await bookApi.getBookChapters(bookId);
        setAllChapters(chaptersResponse.data.chapters || []);

        // Fetch specific chapter by number (backend expects chapter number)
        const chapterResponse = await bookApi.getChapterByNumber(bookId, chapterNumber);
        setChapter(chapterResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load chapter');
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, chapterNumber]);

  // Find prev and next chapters by chapterNumber
  const currentChapterNum = Number(chapterNumber);
  const prevChapter = allChapters.find(c => c.chapterNumber === currentChapterNum - 1);
  const nextChapter = allChapters.find(c => c.chapterNumber === currentChapterNum + 1);

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

  // Render the chapter content with subscription guard only
  return (
    <SubscriptionGuard book={book}>
      <div className='bg-[#1A5632] min-h-screen'>
        {/* Chapter Navigation Bar */}
        <ChapterNavigation
          bookId={bookId}
          currentChapter={chapter}
          allChapters={allChapters}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
        />

        {/* Main Content */}
        <div className='max-w-4xl mx-auto px-4 py-8'>
          <ChapterContent
            chapter={chapter}
            bookId={bookId}
            book={book}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
          />
        </div>
      </div>
    </SubscriptionGuard>
  );
}

export default ReadChapterPage;