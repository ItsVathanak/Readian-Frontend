import axiosInstance from './axiosConfig';

const chapterApi = {
  // Create a new chapter (Author only)
  createChapter: async (bookId, chapterData) => {
    const payload = {
      title: chapterData.title,
      content: chapterData.content
    };

    const response = await axiosInstance.post(`/books/${bookId}/chapters`, payload);
    return response.data;
  },

  // Update chapter (Author only) - Using PATCH
  updateChapter: async (bookId, chapterNumber, chapterData) => {
    const payload = {
      title: chapterData.title,
      content: chapterData.content
    };

    const response = await axiosInstance.patch(`/books/${bookId}/chapters/${chapterNumber}`, payload);
    return response.data;
  },

  // Delete chapter (Author only)
  deleteChapter: async (bookId, chapterNumber) => {
    const response = await axiosInstance.delete(`/books/${bookId}/chapters/${chapterNumber}`);
    return response.data;
  },

  // Get chapter by number
  getChapter: async (bookId, chapterNumber) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters/${chapterNumber}`);
    return response.data;
  },

  // Get all chapters for a book
  getBookChapters: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters`, { params });
    return response.data;
  },

  // Reorder chapters - Send ARRAY format [2, 1, 3]
  reorderChapters: async (bookId, chapterOrder) => {
    console.log('🚀 Sending chapter reorder:', {
      url: `/books/${bookId}/chapters/reorder`,
      method: 'PATCH',
      chapterOrder: chapterOrder,
      isArray: Array.isArray(chapterOrder),
      format: 'array [2, 1, 3]'
    });

    const response = await axiosInstance.patch(`/books/${bookId}/chapters/reorder`, {
      chapterOrder: chapterOrder // Send as array
    });

    console.log('✅ Backend response:', response.data);
    return response.data;
  },
};

export default chapterApi;

