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
    const response = await axiosInstance.delete(`/books/${bookId}/like`);
    return response.data;
  },

  // Get book chapters
  getBookChapters: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters`, { params });
    return response.data;
  },

  // Search books
  searchBooks: async (searchQuery, params = {}) => {
    const response = await axiosInstance.get('/books/search', {
      params: { q: searchQuery, ...params },
    });
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
};

export default bookApi;

