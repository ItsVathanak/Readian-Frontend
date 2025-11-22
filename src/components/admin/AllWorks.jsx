import React, { useState, useEffect, useMemo } from 'react';
import AllWorksCard from './AllWorksCard';
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
      setBooks(response.data.books || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => book.pubStatus === 'published')
      .filter(book => 
        (book.title || "").toLowerCase().includes(titleFilter.toLowerCase())
      )
      .filter(book => 
        (book.author?.name || "").toLowerCase().includes(authorFilter.toLowerCase())
      );
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
      await adminApi.deleteBook(bookToRemove.id, { reason });
      showSuccessToast('Book removed successfully');
      setShowComplete(true);
      await fetchBooks(); // Refresh the book list
    } catch (error) {
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
          filteredBooks.map(book => 
            <AllWorksCard 
              key={book.id} 
              book={book} 
              onRemove={() => handleRemoveClick(book)} 
            />
          )
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