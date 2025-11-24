import React from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('ongoing');
    const [tags, setTags] = useState([]);
    const [genre, setGenre] = useState([]);
    const [premiumStatus, setPremiumStatus] = useState('free');
    const [ageRestriction, setAgeRestriction] = useState(null);
    const [chapters, setChapters] = useState([]);

    // Load book data from API
    useEffect(() => {
        const fetchBook = async () => {
            if (isNew) {
                setTitle('Untitled Book');
                setDescription('');
                setStatus('ongoing');
                setTags([]);
                setGenre([]);
                setPremiumStatus('free');
                setAgeRestriction(null);
                setChapters([]);
                setLoading(false);
            } else {
                try {
                    setLoading(true);
                    const response = await bookApi.getBookById(bookId);
                    const book = response.data;

                    setBookToEdit(book);
                    setTitle(book.title || '');
                    setDescription(book.description || '');
                    setStatus(book.status || 'ongoing');
                    setTags(book.tags || []);
                    setGenre(book.genre || []);
                    setPremiumStatus(book.premiumStatus || 'free');
                    setAgeRestriction(book.ageRestriction || null);
                    setChapters(book.chapters || []);
                } catch (error) {
                    handleApiError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBook();
    }, [bookId, isNew]);

    const dashboardPath = user?.role === "admin" ? "/admindash" : "/authordash/works";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading book...</div>
            </div>
        );
    }

    if (!isNew && !bookToEdit) {
        return <div className="p-8">Book not found.</div>;
    }

    if (!isNew && bookToEdit?.author?.id !== user?.id && user?.role !== 'admin') {
        return <Navigate to="/authordash" replace />;
    }

    // --- Form Handlers ---
    const saveBookData = async () => {
        try {
            // Prepare book data according to API specification
            const bookData = {
                title,
                description,
                bookStatus: status, // API expects 'bookStatus' not 'status'
                tags: Array.isArray(tags) ? tags.join(', ') : tags, // Convert array to comma-separated string
                genre: Array.isArray(genre) ? genre.join(', ') : genre, // Convert array to comma-separated string
                isPremium: premiumStatus === 'premium' || premiumStatus === true,
                contentType: ageRestriction === '18+' ? 'adult' : 'kids',
            };

            // For new books, include chapters as JSON string (required by API)
            if (isNew && chapters.length > 0) {
                bookData.chapters = JSON.stringify(chapters);
            }

            // For updates, include chapters if they exist
            if (!isNew && chapters.length > 0) {
                bookData.chapters = JSON.stringify(chapters);
            }

            if (isNew) {
                const response = await bookApi.createBook(bookData);
                showSuccessToast('Book created successfully!');
                // Backend returns _id in the response
                const newBookId = response.data._id || response.data.id;
                navigate(`/edit/${newBookId}`, { replace: true });
            } else {
                const bookId = bookToEdit.id || bookToEdit._id;
                await bookApi.updateBook(bookId, bookData);
                showSuccessToast('Book updated successfully!');
                // Refresh book data
                window.location.reload();
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleSaveSubmit = async (e) => {
        e.preventDefault();
        await saveBookData();
    };

    const handleEditChapterClick = async (chapterId) => {
        await saveBookData();
        if (!isNew) {
            const bookId = bookToEdit.id || bookToEdit._id;
            navigate(`/edit/${bookId}/chapter/${chapterId}`);
        } else {
            showSuccessToast("Save your new book first before adding chapters.");
        }
    };

    const handleNewChapter = () => {
        if (isNew) {
            // For new books, add a blank chapter to the local state
            const newChapter = {
                id: `temp-${Date.now()}`,
                title: `Chapter ${chapters.length + 1}`,
                content: ''
            };
            setChapters([...chapters, newChapter]);
            showSuccessToast("Chapter added! Fill in the details below.");
        } else {
            const bookId = bookToEdit.id || bookToEdit._id;
            navigate(`/edit/${bookId}/chapter/new`);
        }
    };

    const handleUpdateChapter = (chapterId, field, value) => {
        setChapters(chapters.map(ch =>
            ch.id === chapterId ? { ...ch, [field]: value } : ch
        ));
    };

    const handleDeleteChapter = (chapterId) => {
        setChapters(chapters.filter(ch => ch.id !== chapterId));
        showSuccessToast("Chapter removed");
    };

    const handleDeleteWork = async () => {
        if (window.confirm("Are you sure you want to permanently delete this work?")) {
            try {
                const bookId = bookToEdit.id || bookToEdit._id;
                await bookApi.deleteBook(bookId);
                showSuccessToast('Book deleted successfully!');
                navigate(dashboardPath);
            } catch (error) {
                handleApiError(error);
            }
        }
    };

    const handlePublishWork = async () => {
        if (!isNew) {
            try {
                const bookId = bookToEdit.id || bookToEdit._id;
                const currentStatus = bookToEdit.pubStatus;

                if (currentStatus === 'draft') {
                    // Use dedicated publish endpoint
                    await bookApi.publishBook(bookId);
                    showSuccessToast('Book published successfully!');
                } else {
                    // For unpublishing, use update endpoint
                    await bookApi.updateBook(bookId, { pubStatus: 'draft' });
                    showSuccessToast('Book unpublished successfully!');
                }
                navigate(dashboardPath);
            } catch (error) {
                handleApiError(error);
            }
        } else {
            showSuccessToast('Please save the book first before publishing.');
        }
    };

    return (
        <div className='flex'>
            {/* sidebar */}
            <BookEditSidebar 
                stats={{
                    views: isNew ? 0 : (bookToEdit?.views || 0),
                    likes: isNew ? 0 : (bookToEdit?.likesCount || 0),
                    premiumStatus: premiumStatus,
                    pubStatus: isNew ? 'draft' : (bookToEdit?.pubStatus || 'draft')
                }}
                onDelete={handleDeleteWork}
                isNewBook={isNew}
                onPublishWork={handlePublishWork}
                dashboardPath={dashboardPath}
            />

            {/* display section */}
            <main className='w-[1500px] flex flex-col items-center gap-8 py-8'>
                <BookEditForm
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    status={status}
                    setStatus={setStatus}
                    tags={tags}
                    setTags={setTags}
                    genre={genre}
                    setGenre={setGenre}
                    premiumStatus={premiumStatus}
                    setPremiumStatus={setPremiumStatus}
                    ageRestriction={ageRestriction}
                    setAgeRestriction={setAgeRestriction}
                    onSave={handleSaveSubmit}
                />

                <BookEditChapters 
                    chapters={chapters}
                    onEditChapter={handleEditChapterClick}
                    onNewChapter={handleNewChapter}
                    isNewBook={isNew}
                    onUpdateChapter={handleUpdateChapter}
                    onDeleteChapter={handleDeleteChapter}
                />
            </main>
        </div>
    )
}

export default BookEditPage
