import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterEditorSidebar from '../components/chapEditor/ChapterEditorSidebar';
import ChapterEditorForm from '../components/chapEditor/ChapterEditorForm';
import { useAuth } from '../services/auth/authContext';
import { bookApi, chapterApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function ChapterEditorPage() {
  const { bookId, chapterNumber } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNew = chapterNumber === 'new';

  const [book, setBook] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch book
        const bookResponse = await bookApi.getBookById(bookId);
        setBook(bookResponse.data);

        // Fetch chapters
        const chaptersResponse = await bookApi.getBookChapters(bookId);
        const chapters = chaptersResponse.data.chapters || [];
        setAllChapters(chapters);

        if (!isNew) {
          // Fetch specific chapter
          const chapterResponse = await chapterApi.getChapter(bookId, chapterNumber);
          const chapter = chapterResponse.data;
          setCurrentChapter(chapter);
          setTitle(chapter.title || '');
          setContent(chapter.content || '');
        } else {
          setTitle('');
          setContent('');
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, chapterNumber, isNew]);

  // Check authorization
  if (book && book.author?._id !== user?.id && book.author?.id !== user?.id && user?.role !== 'ADMIN') {
    navigate('/authordash');
    return null;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      showSuccessToast('Please enter a chapter title');
      return;
    }

    try {
      setSaving(true);
      const chapterData = { title, content };

      if (isNew) {
        const response = await chapterApi.createChapter(bookId, chapterData);
        showSuccessToast('Chapter created successfully!');
        const newChapterNumber = response.data.chapterNumber || response.data.data?.chapterNumber || (allChapters.length + 1);
        navigate(`/edit/${bookId}/chapter/${newChapterNumber}`, { replace: true });
      } else {
        await chapterApi.updateChapter(bookId, chapterNumber, chapterData);
        showSuccessToast('Chapter saved successfully!');
        // Refresh chapter data
        const chapterResponse = await chapterApi.getChapter(bookId, chapterNumber);
        setCurrentChapter(chapterResponse.data);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      await chapterApi.deleteChapter(bookId, chapterNumber);
      showSuccessToast('Chapter deleted successfully!');
      navigate(`/edit/${bookId}`);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleChapterSelect = (selectedChapterNumber) => {
    if (selectedChapterNumber === 'new') {
      navigate(`/edit/${bookId}/chapter/new`);
    } else {
      navigate(`/edit/${bookId}/chapter/${selectedChapterNumber}`);
    }
  };

  const currentChapterIndex = allChapters.findIndex(
    c => c.chapterNumber === Number(chapterNumber)
  );
  const prevChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE]">
        <div className="text-2xl">Loading chapter...</div>
      </div>
    );
  }

  if (!book) {
    return <div className="p-8">Book not found.</div>;
  }

  return (
    <div className='flex min-h-screen bg-[#FFFDEE]'>
      <ChapterEditorSidebar
        onDelete={!isNew ? handleDelete : null}
        onBackToBook={() => navigate(`/edit/${bookId}`)}
        isNew={isNew}
      />

      <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='geist text-4xl font-bold mb-4 text-[#1A5632]'>
            {isNew ? 'Create New Chapter' : `Edit Chapter ${chapterNumber}`}
          </h1>
          <h2 className='text-xl text-gray-600 mb-8'>
            Book: {book.title}
          </h2>

          {/* Chapter Dropdown Navigation */}
          <div className='mb-6 bg-white p-4 rounded-lg shadow-md'>
            <label className='block font-semibold mb-2 text-gray-700'>
              Navigate to Chapter:
            </label>
            <select
              value={isNew ? 'new' : chapterNumber}
              onChange={(e) => handleChapterSelect(e.target.value)}
              className='w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-lg font-medium focus:border-[#1A5632] focus:outline-none'
            >
              {allChapters.map((chapter, index) => (
                <option key={chapter.id || chapter._id} value={chapter.chapterNumber || index + 1}>
                  {isNew ? '' : (chapter.chapterNumber || index + 1) === Number(chapterNumber) ? '▶ ' : ''}
                  Chapter {chapter.chapterNumber || index + 1}: {chapter.title}
                </option>
              ))}
              <option value='new'>+ Add New Chapter</option>
            </select>
          </div>

          {/* Previous/Next Navigation */}
          {!isNew && (
            <div className='flex justify-between mb-6'>
              <button
                onClick={() => prevChapter && handleChapterSelect(prevChapter.chapterNumber)}
                disabled={!prevChapter}
                className='px-4 py-2 bg-[#C0FFB3] text-[#1A5632] rounded-lg font-semibold hover:bg-[#00A819] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                ← Previous Chapter
              </button>
              <button
                onClick={() => nextChapter && handleChapterSelect(nextChapter.chapterNumber)}
                disabled={!nextChapter}
                className='px-4 py-2 bg-[#C0FFB3] text-[#1A5632] rounded-lg font-semibold hover:bg-[#00A819] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next Chapter →
              </button>
            </div>
          )}

          <ChapterEditorForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            onSave={handleSave}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}

export default ChapterEditorPage;

