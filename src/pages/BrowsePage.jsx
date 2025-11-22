import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BrowseSidebar from '../components/browse/BrowseSidebar'
import BrowseBookGrid from '../components/browse/BrowseBookGrid'
import { bookApi } from '../services/api'
import { useAuth } from '../services/auth/authContext'
import { handleApiError } from '../services/utils/errorHandler'

const BrowsePage = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [allBooks, setAllBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    //get tag from url. default all
    const initialTag = searchParams.get('tag') || '';

    //state for all filters
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [status, setStatus] = useState('All');
    const [tags, setTags] = useState(initialTag);
    const [minLikes, setMinLikes] = useState(0);

    // Fetch all books
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await bookApi.getAllBooks({ status: 'published' });
                setAllBooks(response.data.books || []);
            } catch (err) {
                handleApiError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    //filter book logic
    const filteredBooks = useMemo(() => {
        let books = [...allBooks];

        //premium filter
        const canSeePremium = user?.role === 'ADMIN' || user?.subscriptionStatus === 'active';
        if (!canSeePremium) {
            books = books.filter(book => !book.isPremium)
        }

        // NOTE: Age-based content filtering is handled by the backend API
        // Backend filters based on contentType (kids/teen/adult) and user age
        // No need for additional frontend filtering

        //title filter
        if (title) {
            books = books.filter(book => (book.title || "").toLowerCase().includes(title.toLowerCase()));
        }

        //author filter
        if (author) {
            books = books.filter(book => {
                const authorName = book.author?.name || book.authorName || "";
                return authorName.toLowerCase().includes(author.toLowerCase());
            });
        }

        //status filter (bookStatus from backend: ongoing, finished, hiatus)
        if (status !== 'All') {
            books = books.filter(book => book.bookStatus === status);
        }

        //tag filter
        // cleaning tag filter string
        const filterTags = tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length > 0)

        //apply tag filter
        if (filterTags.length > 0) {
            books = books.filter(book => {
                // Handle tags as string (from backend) or array
                const bookTagsStr = book.tags || "";
                const bookTags = Array.isArray(book.tags)
                    ? book.tags.map(t => t.toLowerCase())
                    : bookTagsStr.toLowerCase().split(',').map(t => t.trim());

                // hybrid filter (if 1 tag typed, search book with tag. If multiple typed, search book will all tags typed)
                if (filterTags.length === 1) {
                    return bookTags.some(tag => tag.includes(filterTags[0]) || filterTags[0].includes(tag));
                } else {
                    return filterTags.every(filterTag =>
                        bookTags.some(bookTag => bookTag.includes(filterTag) || filterTag.includes(bookTag))
                    );
                }
            })
        };

        //min like filter
        if (minLikes > 0) {
            books = books.filter(book => (book.likes || book.likesCount || 0) >= minLikes);
        }

        //if no filters, sort by date
        if (!title && !author && status === 'All' && tags === '' && minLikes === 0) {
            books.sort((a, b) => new Date(b.createdAt || b.publishDate) - new Date(a.createdAt || a.publishDate));
        }

        return books.sort((a, b) => new Date(b.createdAt || b.publishDate) - new Date(a.createdAt || a.publishDate));
    },[title, author, status, tags, minLikes, allBooks, user]); //refilter when any of these change

    if (loading) {
        return (
            <div className="bg-[#FFFDEE] min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading books...</div>
            </div>
        );
    }

  return (
    <div className='bg-[#FFFDEE] flex min-h-screen relative'>
        <BrowseSidebar 
            title = {title}
            setTitle = {setTitle}
            author = {author}
            setAuthor = {setAuthor}
            status = {status}
            setStatus = {setStatus}
            tags = {tags}
            setTags = {setTags}
            minLikes = {minLikes}
            setMinLikes = {setMinLikes}
        />
        {/* book list  */}
        <BrowseBookGrid filteredBooks={filteredBooks}/>
    </div>
  )
}

export default BrowsePage
