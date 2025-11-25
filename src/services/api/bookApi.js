import axiosInstance from './axiosConfig';

const bookApi = {
  getAllBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', { params });
    return response.data;
  },

  getBookById: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}`);
    return response.data;
  },

  createBook: async (bookData) => {
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

  updateBookImage: async (bookId, imageUrl) => {
    console.log('🖼️ Updating book image URL:', imageUrl);
    const response = await axiosInstance.patch(`/books/${bookId}`, {
      image: imageUrl
    });
    console.log('✅ Image update response:', response.data);
    return response.data;
  },

  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
  },

  publishBook: async (bookId) => {
    const response = await axiosInstance.patch(`/books/${bookId}`, { status: 'published' });
    return response.data;
  },

  likeBook: async (bookId) => {
    const response = await axiosInstance.post(`/books/${bookId}/like`);
    return response.data;
  },

  unlikeBook: async (bookId) => {
    const response = await axiosInstance.post(`/books/${bookId}/unlike`);
    return response.data;
  },

  getBookChapters: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters`, { params });

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

    return {
      ...response.data,
      data: {
        chapters,
        pagination: response.data.pagination || response.data.data?.pagination || {}
      }
    };
  },

  getChapterByNumber: async (bookId, chapterNumber) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters/${chapterNumber}`);
    return response.data;
  },

  searchBooks: async (filters = {}) => {
    const response = await axiosInstance.get('/books/search', { params: filters });
    return response.data;
  },

  getBooksByGenre: async (genre, params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { genre, ...params },
    });
    return response.data;
  },

  getBooksByAuthor: async (authorId, params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { authorId, ...params },
    });
    return response.data;
  },

  getTrendingBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { sort: 'trending', ...params },
    });
    return response.data;
  },

  getPopularBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', {
      params: { sort: 'popular', ...params },
    });
    return response.data;
  },

  rateBook: async (bookId, rating) => {
    const response = await axiosInstance.post(`/books/${bookId}/rate`, { rating });
    return response.data;
  },
};

export default bookApi;

