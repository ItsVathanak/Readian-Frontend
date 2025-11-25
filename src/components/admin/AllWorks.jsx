import React, { useState, useEffect, useMemo } from 'react';
import BookCard from '../browse/BookCard';
import RemoveBookPopup from './RemoveBookPopup';
import BookRemovalCompletePopup from './BookRemovalCompletePopup';
import { adminApi } from '../../services/api';
import { handleApiError, showSuccessToast } from '../../services/utils/errorHandler';

function AllWorks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [bookToRemove, setBookToRemove] = useState(null);
  const [reason, setReason] = useState('');
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllBooks();
      console.log('📚 Admin getAllBooks response:', response.data);
      console.log('📖 Total books received:', response.data.books?.length || 0);
      setBooks(response.data.books || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    console.log('🔍 Filtering books, total:', books.length);

    // Filter for published books - check multiple field names
    const publishedBooks = books.filter(book => {
      // Check various possible field names for status
      const isPublished =
        book.status === 'published' ||
        book.pubStatus === 'published' ||
        book.publicationStatus === 'published';

      if (!isPublished) {
        console.log('❌ Book not published:', book.title, 'status:', book.status || book.pubStatus);
      }
      return isPublished;
    });

    console.log('✅ Published books:', publishedBooks.length);

    // Apply title filter
    const titleFiltered = publishedBooks.filter(book =>
      (book.title || "").toLowerCase().includes(titleFilter.toLowerCase())
    );

    // Apply author filter
    const result = titleFiltered.filter(book =>
      (book.author?.name || "").toLowerCase().includes(authorFilter.toLowerCase())
    );

    console.log('📊 After filters:', result.length);
    return result;
  }, [books, titleFilter, authorFilter]);

  // --- Handler Functions ---

  // Called by AllWorksCard: opens the first popup
  const handleRemoveClick = (book) => {
    setBookToRemove(book);
  };

  // Called by RemoveBookPopup: closes the first popup
  const handleCancelRemove = () => {
    setBookToRemove(null);
    setReason('');
  };

  const handleConfirmRemove = async () => {
    if (!reason) {
      alert("Please provide a reason for removal.");
      return;
    }

    try {
      const bookId = bookToRemove.id || bookToRemove._id;
      console.log('🗑️ Deleting book:', bookId, 'Reason:', reason);

      await adminApi.deleteBook(bookId, { reason });
      showSuccessToast('Book removed successfully');
      setShowComplete(true);
      await fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error('Delete book error:', error);
      handleApiError(error);
    }
  };

  const handleFinalConfirm = () => {
    setShowComplete(false);
    setBookToRemove(null);
    setReason('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl">Loading books...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="geist text-5xl font-bold mb-8 text-[#00A819]">All Works</h1>
      
      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Filter by title..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="p-2 border rounded-lg w-1/2"
        />
        <input 
          type="text" 
          placeholder="Filter by author..."
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="p-2 border rounded-lg w-1/2"
        />
      </div>

      {/* Grid of All Works */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 2xl:gap-2 w-full place-items-center">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => {
            const bookId = book.id || book._id;
            return (
              <div key={bookId} className="relative w-full max-w-[650px] admin-book-card group">
                <BookCard book={book} linkTo={`/book/${bookId}`} disableHoverScale={true} />
                {/* Admin Remove Button Overlay */}
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[10px]" style={{ zIndex: 50 }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveClick(book);
                    }}
                    className="bg-red-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-lg"
                  >
                    Remove Book
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No books match your criteria.</p>
        )}
      </div>

      {/* --- Popups --- */}
      
      {/* 1. First Popup: "Are you sure?" */}
      {bookToRemove && !showComplete && (
        <RemoveBookPopup
          book={bookToRemove}
          reason={reason}
          setReason={setReason}
          onConfirm={handleConfirmRemove}
          onAbort={handleCancelRemove}
        />
      )}

      {/* 2. Second Popup: "Removal complete" */}
      {bookToRemove && showComplete && (
        <BookRemovalCompletePopup
          book={bookToRemove}
          reason={reason}
          onConfirm={handleFinalConfirm}
        />
      )}
    </div>
  );
}

export default AllWorks;