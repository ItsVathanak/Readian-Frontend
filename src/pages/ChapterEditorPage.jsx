import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChapterEditorSidebar from '../components/chapEditor/ChapterEditorSidebar';
import ChapterEditorForm from '../components/chapEditor/ChapterEditorForm';
import { useAuth } from '../services/auth/authContext';
import { bookApi, chapterApi } from '../services/api';
import { handleApiError, showSuccessToast } from '../services/utils/errorHandler';

function ChapterEditorPage() {
    const { bookId, chapterId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isNew = chapterId === 'new';

    const [book, setBook] = useState(null);
    const [allChapters, setAllChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [chapterNumber, setChapterNumber] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch book
                const bookResponse = await bookApi.getBookById(bookId);
                setBook(bookResponse.data);

                // Fetch chapters
                const chaptersResponse = await bookApi.getBookChapters(bookId);
                setAllChapters(chaptersResponse.data.chapters || []);

                if (!isNew) {
                    // Fetch specific chapter
                    const chapterResponse = await chapterApi.getChapterById(chapterId);
                    const chapter = chapterResponse.data;
                    setCurrentChapter(chapter);
                    setTitle(chapter.title || '');
                    setContent(chapter.content || '');
                    setChapterNumber(chapter.chapterNumber || 1);
                } else {
                    setTitle('Untitled Chapter');
                    setContent('');
                    setChapterNumber((chaptersResponse.data.chapters?.length || 0) + 1);
                }
            } catch (error) {
                handleApiError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookId, chapterId, isNew]);

    const currentChapterIndex = allChapters.findIndex(c => c.id === Number(chapterId));
    const prevChapter = currentChapterIndex > 0 ? allChapters[currentChapterIndex - 1] : null;
    const nextChapter = currentChapterIndex < allChapters.length - 1 ? allChapters[currentChapterIndex + 1] : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading chapter...</div>
            </div>
        );
    }

    if (!book) {
        return <div className="p-8">Book not found.</div>;
    }

    if (book.author?.id !== user?.id && user?.role !== 'admin') {
        navigate('/authordash');
        return null;
    }

    if (!isNew && !currentChapter) {
        return <div className="p-8">Chapter not found.</div>;
    }

    const handleSave = async () => {
        try {
            const chapterData = {
                title,
                content,
                chapterNumber,
            };

            if (isNew) {
                const response = await chapterApi.createChapter(bookId, chapterData);
                showSuccessToast('Chapter created successfully!');
                navigate(`/edit/${bookId}/chapter/${response.data.id}`, { replace: true });
            } else {
                await chapterApi.updateChapter(chapterId, chapterData);
                showSuccessToast('Chapter saved successfully!');
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleBackToBookEdit = () => {
        navigate(`/edit/${bookId}`);
    };

    const handleDeleteChapter = async () => {
        if (window.confirm("Are you sure you want to delete this chapter?")) {
            try {
                await chapterApi.deleteChapter(chapterId);
                showSuccessToast('Chapter deleted successfully!');
                navigate(`/edit/${bookId}`);
            } catch (error) {
                handleApiError(error);
            }
        }
    };

    const handleNavChange = async (e) => {
        const newChapterId = e.target.value;
        await handleSave();
        navigate(`/edit/${bookId}/chapter/${newChapterId}`);
    };

    const handleNavPrev = async () => {
        if (prevChapter) {
            await handleSave();
            navigate(`/edit/${bookId}/chapter/${prevChapter.id}`);
        }
    };

    const handleNavNext = async () => {
        if (nextChapter) {
            await handleSave();
            navigate(`/edit/${bookId}/chapter/${nextChapter.id}`);
        }
    };

    return (
        // Main container
        <div className="flex min-h-screen">
            <ChapterEditorSidebar
                bookId={book.id}
                chapterList={chapterList}
                currentChapterId={chapterId}
                currentChapterTitle={currentChapter.title}
                onNavChange={handleNavChange}
                onBack={handleBackToBookEdit}
                onDelete={handleDeleteChapter}
            />
      
            <ChapterEditorForm
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                prevChapter={prevChapter}
                nextChapter={nextChapter}
                onNavPrev={handleNavPrev}
                onNavNext={handleNavNext}
                handleSave={handleSave}
            />
        </div>
    );
}

export default ChapterEditorPage;