import axiosInstance from './axiosConfig';
import { createFormData } from '../utils/apiHelpers';

const bookApi = {
  // Get all books with filters
  getAllBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', { params });
    return response.data;
  },

  // Get book by ID
  getBookById: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}`);
    return response.data;
  },

  // Create a new book (Author only)
  createBook: async (bookData) => {
    const formData = createFormData(bookData);
    const response = await axiosInstance.post('/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update book (Author only)
  updateBook: async (bookId, bookData) => {
    const formData = createFormData(bookData);
    const response = await axiosInstance.put(`/books/${bookId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete book (Author only)
  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
  },

  // Publish book (Author/Admin only)
  publishBook: async (bookId) => {
    const response = await axiosInstance.post(`/books/${bookId}/publish`);
    return response.data;
  },

  // Upload book cover
  uploadBookCover: async (bookId, file) => {
    const formData = createFormData({ coverImage: file });
    const response = await axiosInstance.post(`/books/${bookId}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Like a book
  likeBook: async (bookId) => {
    const response = await axiosInstance.post(`/books/${bookId}/like`);
    return response.data;
  },

  // Unlike a book
  unlikeBook: async (bookId) => {
    const response = await axiosInstance.post(`/books/${bookId}/unlike`);
    return response.data;
  },

  // Get book chapters
  getBookChapters: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters`, { params });
    console.log('📖 getBookChapters raw response:', response.data);

    // Handle response structure
    let chapters = [];
    if (response.data.data?.chapters) {
      chapters = response.data.data.chapters;
    } else if (Array.isArray(response.data.data)) {
      chapters = response.data.data;
    } else if (response.data.chapters) {
      chapters = response.data.chapters;
    }

    // Ensure chapters have proper structure
    chapters = chapters.map(chapter => ({
      ...chapter,
      id: chapter._id || chapter.id
    }));

    const result = {
      ...response.data,
      data: {
        chapters,
        pagination: response.data.pagination || response.data.data?.pagination || {}
      }
    };

    console.log('✅ getBookChapters transformed result:', result);
    return result;
  },

  // Get specific chapter by number
  getChapterByNumber: async (bookId, chapterNumber) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters/${chapterNumber}`);
    return response.data;
  },

  // Search books with advanced filters
  searchBooks: async (filters = {}) => {
    // Backend expects: title, author, genre, tags, page, limit
    const response = await axiosInstance.get('/books/search', { params: filters });
    return response.data;
  },

  // Get books by genre
  getBooksByGenre: async (genre, params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { genre, ...params },
    });
    return response.data;
  },

  // Get books by author
  getBooksByAuthor: async (authorId, params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { authorId, ...params },
    });
    return response.data;
  },

  // Get trending books
  getTrendingBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { sort: 'trending', ...params },
    });
    return response.data;
  },

  // Get popular books
  getPopularBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { sort: 'popular', ...params },
    });
    return response.data;
  },

  // Rate a book (1-5 stars)
  rateBook: async (bookId, rating) => {
    const response = await axiosInstance.post(`/books/${bookId}/rate`, { rating });
    return response.data;
  },

  // Get user's rating for a book
  getMyRating: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}/rating/me`);
    return response.data;
  },

  // Delete user's rating
  deleteRating: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}/rate`);
    return response.data;
  },

  // Download a book as PDF (premium feature)
  downloadBook: async (bookId) => {
    const response = await axiosInstance.post(`/books/${bookId}/download`, {}, {
      responseType: 'blob' // Important for file downloads
    });
    return response;
  },
};

export default bookApi;

