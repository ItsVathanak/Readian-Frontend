// Utility functions for transforming API data to match frontend expectations

/**
 * Transform book data from backend to frontend format
 * Adds convenience fields for easier access to nested data
 */
export const transformBook = (book) => {
  if (!book) return null;

  return {
    ...book,
    // Add convenience fields for author info
    authorName: book.author?.name || 'Unknown Author',
    authorAvatar: book.author?.avatar || null,
    authorId: book.author?._id || book.author,

    // Ensure tags is always a string
    tags: Array.isArray(book.tags) ? book.tags.join(', ') : (book.tags || ''),

    // Ensure likes is a number
    likes: book.likes || book.likesCount || (book.likedBy?.length || 0),

    // Add total ratings if not present
    totalRatings: book.totalRatings || book.ratings?.length || 0,
  };
};

/**
 * Transform array of books
 */
export const transformBooks = (books) => {
  if (!Array.isArray(books)) return [];
  return books.map(transformBook);
};

/**
 * Transform pagination response
 */
export const transformPaginationResponse = (response) => {
  return {
    books: transformBooks(response.data?.books || response.books || []),
    pagination: response.data?.pagination || response.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalBooks: 0,
      hasMore: false
    }
  };
};

