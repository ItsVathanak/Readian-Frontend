import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import BookEditSidebar from '../components/bookEdit/BookEditSidebar';
import BookEditForm from '../components/bookEdit/BookEditForm';
import BookEditChapters from '../components/bookEdit/BookEditChapters';
import { useAuth } from '../services/auth/authContext';
import { bookApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

const BookEditPage = () => {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNew = bookId === 'new';

  const [bookToEdit, setBookToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('draft'); // draft by default
  const [tags, setTags] = useState([]);
  const [genre, setGenre] = useState([]);
  const [premiumStatus, setPremiumStatus] = useState(false); // false by default
  const [contentType, setContentType] = useState('kids');
  const [bookStatus, setBookStatus] = useState('ongoing');
  const [chapters, setChapters] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');

  // Load book data
  useEffect(() => {
    const fetchBook = async () => {
      if (isNew) {
        setTitle('Untitled Book');
        setDescription('');
        setStatus('draft');
        setTags([]);
        setGenre([]);
        setPremiumStatus(false);
        setContentType('kids');
        setBookStatus('ongoing');
        setChapters([]);
        setCoverImageUrl('');
        setLoading(false);
      } else {
        try {
          setLoading(true);
          const response = await bookApi.getBookById(bookId);
          const book = response.data;

          setBookToEdit(book);
          setTitle(book.title || '');
          setDescription(book.description || '');
          setStatus(book.status || 'draft');
          setTags(Array.isArray(book.tags) ? book.tags : (book.tags ? book.tags.split(',').map(t => t.trim()) : []));
          setGenre(Array.isArray(book.genre) ? book.genre : (book.genre ? book.genre.split(',').map(g => g.trim()) : []));
          setPremiumStatus(book.isPremium || false);
          setContentType(book.contentType || 'kids');
          setBookStatus(book.bookStatus || 'ongoing');
          setChapters(book.chapters || []);
          setCoverImageUrl(book.image || '');
        } catch (error) {
          handleApiError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBook();
  }, [bookId, isNew]);

  // Check authorization
  if (!isNew && bookToEdit && bookToEdit.author?._id !== user?.id && bookToEdit.author?.id !== user?.id && user?.role !== 'ADMIN') {
    return <Navigate to="/authordash" replace />;
  }

  // Save book
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      let imageUrl = coverImageUrl;

      // Upload cover image if provided
      if (coverImage) {
        showSuccessToast('Uploading cover image...');
        imageUrl = await bookApi.uploadImageToCloudinary(coverImage);
        setCoverImageUrl(imageUrl);
      }

      const bookData = {
        title,
        description,
        tags: Array.isArray(tags) ? tags.join(', ') : tags,
        genre: Array.isArray(genre) ? genre.join(', ') : genre,
        isPremium: premiumStatus,
        status,
        image: imageUrl,
        contentType,
        bookStatus,
        chapters: isNew ? chapters : undefined // Only send chapters for new books
      };

      if (isNew) {
        const response = await bookApi.createBook(bookData);
        showSuccessToast('Book created successfully!');
        const newBookId = response.data._id || response.data.id || response.data.data?._id;
        navigate(`/edit/${newBookId}`, { replace: true });
      } else {
        await bookApi.updateBook(bookId, bookData);
        showSuccessToast('Book updated successfully!');
        // Refresh book data
        const updatedResponse = await bookApi.getBookById(bookId);
        setBookToEdit(updatedResponse.data);
        setCoverImage(null);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  // Publish book
  const handlePublish = async () => {
    if (isNew) {
      setStatus('published');
      showSuccessToast('Book will be published when you save it');
      return;
    }

    try {
      await bookApi.publishBook(bookId);
      setStatus('published');
      showSuccessToast('Book published successfully!');
      const updatedResponse = await bookApi.getBookById(bookId);
      setBookToEdit(updatedResponse.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Delete book
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This will also delete all chapters.')) {
      return;
    }

    try {
      await bookApi.deleteBook(bookId);
      showSuccessToast('Book deleted successfully!');
      navigate('/authordash/works');
    } catch (error) {
      handleApiError(error);
    }
  };

  // Add chapter (for new books)
  const handleAddChapter = () => {
    const newChapter = {
      id: `temp-${Date.now()}`,
      title: `Chapter ${chapters.length + 1}`,
      content: ''
    };
    setChapters([...chapters, newChapter]);
  };

  // Update chapter (for new books)
  const handleUpdateChapter = (chapterId, field, value) => {
    setChapters(chapters.map(ch =>
      ch.id === chapterId ? { ...ch, [field]: value } : ch
    ));
  };

  // Delete chapter (for new books)
  const handleDeleteChapter = (chapterId) => {
    setChapters(chapters.filter(ch => ch.id !== chapterId));
    showSuccessToast('Chapter removed');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDEE]">
        <div className="text-2xl">Loading book...</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-[#FFFDEE]'>
      <BookEditSidebar
        onPublish={status === 'draft' ? handlePublish : null}
        onDelete={!isNew ? handleDelete : null}
        isPublished={status === 'published'}
        isNew={isNew}
      />

      <div className='flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='geist text-4xl font-bold mb-8 text-[#1A5632]'>
            {isNew ? 'Create New Book' : 'Edit Book'}
          </h1>

          <BookEditForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            status={status}
            setStatus={setStatus}
            bookStatus={bookStatus}
            setBookStatus={setBookStatus}
            tags={tags}
            setTags={setTags}
            genre={genre}
            setGenre={setGenre}
            premiumStatus={premiumStatus}
            setPremiumStatus={setPremiumStatus}
            contentType={contentType}
            setContentType={setContentType}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            existingCoverUrl={coverImageUrl}
            onSave={handleSave}
            uploading={uploading}
          />

          {/* Chapter Management for NEW books */}
          {isNew && (
            <div className='mt-8 bg-white rounded-lg p-6 shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-[#1A5632]'>Initial Chapters (Optional)</h2>
                <button
                  onClick={handleAddChapter}
                  type="button"
                  className='px-4 py-2 bg-[#1A5632] text-white rounded-lg hover:bg-[#00A819] transition-all'
                >
                  + Add Chapter
                </button>
              </div>

              {chapters.length === 0 && (
                <p className='text-gray-500 text-center py-4'>
                  No chapters yet. You can add them now or after creating the book.
                </p>
              )}

              {chapters.map((chapter, index) => (
                <div key={chapter.id} className='bg-gray-50 p-4 rounded-lg mb-4 border-2 border-gray-200'>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='font-bold text-lg'>Chapter {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className='text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50'
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type='text'
                    value={chapter.title}
                    onChange={(e) => handleUpdateChapter(chapter.id, 'title', e.target.value)}
                    placeholder='Chapter Title'
                    className='w-full p-2 border rounded mb-2 bg-white'
                  />
                  <textarea
                    value={chapter.content}
                    onChange={(e) => handleUpdateChapter(chapter.id, 'content', e.target.value)}
                    placeholder='Chapter Content'
                    className='w-full p-2 border rounded h-32 bg-white'
                  />
                </div>
              ))}
            </div>
          )}

          {/* Chapter Management for EXISTING books */}
          {!isNew && (
            <BookEditChapters bookId={bookId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookEditPage;

