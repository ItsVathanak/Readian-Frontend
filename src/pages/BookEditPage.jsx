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
            const bookData = {
                title,
                description,
                status,
                tags,
                genre,
                premiumStatus,
                ageRestriction: ageRestriction || undefined,
            };

            if (isNew) {
                const response = await bookApi.createBook(bookData);
                showSuccessToast('Book created successfully!');
                navigate(`/edit/${response.data.id}`, { replace: true });
            } else {
                await bookApi.updateBook(bookToEdit.id, bookData);
                showSuccessToast('Book updated successfully!');
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
            navigate(`/edit/${bookToEdit.id}/chapter/${chapterId}`);
        } else {
            showSuccessToast("Save your new book first before adding chapters.");
        }
    };

    const handleNewChapter = () => {
        if (isNew) {
            showSuccessToast("Please save the book first before adding chapters.");
            return;
        }
        navigate(`/edit/${bookToEdit.id}/chapter/new`);
    };

    const handleDeleteWork = async () => {
        if (window.confirm("Are you sure you want to permanently delete this work?")) {
            try {
                await bookApi.deleteBook(bookToEdit.id);
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
                const newPubStatus = bookToEdit.pubStatus === 'draft' ? 'published' : 'draft';
                await bookApi.updateBook(bookToEdit.id, { pubStatus: newPubStatus });
                showSuccessToast(`Book ${newPubStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
                navigate(dashboardPath);
            } catch (error) {
                handleApiError(error);
            }
        } else {
            await saveBookData();
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
                />
            </main>
        </div>
    )
}

export default BookEditPage
