import axiosInstance from './axiosConfig';

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
    // Send as JSON for creating book with chapters
    const payload = {
      title: bookData.title,
      description: bookData.description || '',
      tags: bookData.tags || '',
      genre: bookData.genre || '',
      isPremium: bookData.isPremium || false,
      status: bookData.status || 'draft',
      image: bookData.image || '',
      contentType: bookData.contentType || 'kids',
      bookStatus: bookData.bookStatus || 'ongoing',
      chapters: bookData.chapters || []
    };

    const response = await axiosInstance.post('/books', payload);
    return response.data;
  },

  // Update book (Author only) - Using PATCH
  updateBook: async (bookId, bookData) => {
    const payload = {};

    if (bookData.title !== undefined) payload.title = bookData.title;
    if (bookData.description !== undefined) payload.description = bookData.description;
    if (bookData.tags !== undefined) payload.tags = bookData.tags;
    if (bookData.genre !== undefined) payload.genre = bookData.genre;
    if (bookData.isPremium !== undefined) payload.isPremium = bookData.isPremium;
    if (bookData.status !== undefined) payload.status = bookData.status;
    if (bookData.contentType !== undefined) payload.contentType = bookData.contentType;
    if (bookData.bookStatus !== undefined) payload.bookStatus = bookData.bookStatus;
    if (bookData.image !== undefined) payload.image = bookData.image;

    const response = await axiosInstance.patch(`/books/${bookId}`, payload);
    return response.data;
  },

  // Upload book cover image - Exact same pattern as profile image
  updateBookCover: async (bookId, file) => {
    const formData = new FormData();
    formData.append('image', file); // Field name: 'image'
    const response = await axiosInstance.post(`/books/${bookId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete book (Author only)
  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
  },

  // Publish book (change status to published)
  publishBook: async (bookId) => {
    const response = await axiosInstance.patch(`/books/${bookId}`, { status: 'published' });
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

    let chapters = [];
    if (response.data.data?.chapters) {
      chapters = response.data.data.chapters;
    } else if (Array.isArray(response.data.data)) {
      chapters = response.data.data;
    } else if (response.data.chapters) {
      chapters = response.data.chapters;
    }

    chapters = chapters.map((chapter, index) => ({
      ...chapter,
      id: chapter._id || chapter.id,
      chapterNumber: chapter.chapterNumber || index + 1
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
};

export default bookApi;

