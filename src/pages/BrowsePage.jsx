import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import BrowseSidebar from '../components/browse/BrowseSidebar'
import BrowseBookGrid from '../components/browse/BrowseBookGrid'
import { bookApi } from '../services/api'
import { useAuth } from '../services/auth/authContext'
import { handleApiError } from '../services/utils/errorHandler'
import { transformBooks } from '../services/utils/dataTransformers'

const BrowsePage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    //get tag and search query from url
    const initialTag = searchParams.get('tag') || '';
    const searchQuery = searchParams.get('search') || '';

    //state for all filters - input values (immediate, what user types)
    const [titleInput, setTitleInput] = useState(searchQuery);
    const [authorInput, setAuthorInput] = useState('');
    const [genreInput, setGenreInput] = useState('');
    const [tagsInput, setTagsInput] = useState(initialTag);

    // Debounced filter values (used for actual API search)
    const [title, setTitle] = useState(searchQuery);
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('All');
    const [tags, setTags] = useState(initialTag);
    const [genre, setGenre] = useState('');
    const [minLikes, setMinLikes] = useState(0);

    // Update title when search query changes
    useEffect(() => {
        const newSearchQuery = searchParams.get('search') || '';
        if (newSearchQuery) {
            setTitleInput(newSearchQuery);
            setTitle(newSearchQuery);
        }
    }, [searchParams]);

    // Update tags when URL tag parameter changes
    useEffect(() => {
        const newTag = searchParams.get('tag') || '';
        if (newTag) {
            setTagsInput(newTag);
            setTags(newTag);
        }
    }, [searchParams]);

    // Manual search trigger - called when user presses Enter
    const handleSearch = () => {
        setTitle(titleInput);
        setAuthor(authorInput);
        setGenre(genreInput);
        setTags(tagsInput);
    };

    // Observer for infinite scroll
    const observerTarget = useRef(null);

    // Fetch books with filters
    const fetchBooks = useCallback(async (page = 1, appendResults = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // Determine if we have any active filters
            const hasFilters = title || author || genre || (tags && tags !== initialTag);

            let response;

            if (hasFilters) {
                // Use search endpoint with filters
                const filters = {
                    ...(title && { title }),
                    ...(author && { author }),
                    ...(genre && { genre }),
                    ...(tags && { tags }),
                    page,
                    limit: 12
                };
                response = await bookApi.searchBooks(filters);
            } else {
                // Use getAllBooks for simple list
                response = await bookApi.getAllBooks({ page, limit: 12 });
            }

            const books = transformBooks(response.data?.books || []);
            const pagination = response.data?.pagination || {};

            if (appendResults) {
                setAllBooks(prev => [...prev, ...books]);
            } else {
                setAllBooks(books);
            }

            setHasMore(pagination.hasMore || false);
            setCurrentPage(page);
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [title, author, genre, tags, initialTag]);

    // Initial load and filter changes
    useEffect(() => {
        setCurrentPage(1);
        fetchBooks(1, false);
    }, [fetchBooks]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    fetchBooks(currentPage + 1, true);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, loading, loadingMore, currentPage, fetchBooks]);

    // Apply frontend-only filters (min likes and status)
    const filteredBooks = allBooks.filter(book => {
        // Status filter (bookStatus from backend: ongoing, finished, hiatus)
        if (status !== 'All' && book.bookStatus !== status) {
            return false;
        }

        // Min likes filter (frontend only since backend doesn't support this)
        if (minLikes > 0 && (book.likes || 0) < minLikes) {
            return false;
        }

        return true;
    });

    if (loading) {
        return (
            <div className="bg-[#FFFDEE] min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-[#C0FFB3] border-t-[#1A5632] rounded-full animate-spin"></div>
                    <div className="text-xl font-semibold text-gray-700">Loading books...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-[#FFFDEE] min-h-screen'>
            <div className='flex flex-col lg:flex-row relative'>
                <BrowseSidebar
                    title={titleInput}
                    setTitle={setTitleInput}
                    author={authorInput}
                    setAuthor={setAuthorInput}
                    status={status}
                    setStatus={setStatus}
                    tags={tagsInput}
                    setTags={setTagsInput}
                    genre={genreInput}
                    setGenre={setGenreInput}
                    minLikes={minLikes}
                    setMinLikes={setMinLikes}
                />
                <div className="flex-1">
                    <BrowseBookGrid filteredBooks={filteredBooks}/>

                    {/* Infinite scroll trigger */}
                    {hasMore && (
                        <div
                            ref={observerTarget}
                            className="flex justify-center items-center py-8"
                        >
                            {loadingMore && (
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 border-3 border-[#C0FFB3] border-t-[#1A5632] rounded-full animate-spin"></div>
                                    <span className="text-gray-600">Loading more books...</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* No more books message */}
                    {!hasMore && allBooks.length > 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No more books to load
                        </div>
                    )}

                    {/* No books found */}
                    {!loading && allBooks.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-600 mb-2">No books found</p>
                            <p className="text-gray-500">Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrowsePage;
