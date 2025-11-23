import axiosInstance from './axiosConfig';
import { createFormData } from '../utils/apiHelpers';

const chapterApi = {
  // Get chapter by ID
  getChapterById: async (chapterId) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters/${chapterId}`);
    return response.data;
  },

  // Create a new chapter (Author only)
  createChapter: async (bookId, chapterData) => {
    const formData = createFormData(chapterData);
    const response = await axiosInstance.post(`/books/${bookId}/chapters`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update chapter (Author only)
  updateChapter: async (chapterId, chapterData) => {
    const formData = createFormData(chapterData);
    const response = await axiosInstance.put(`/books/${bookId}/chapters/${chapterId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete chapter (Author only)
  deleteChapter: async (chapterId) => {
    const response = await axiosInstance.delete(`/books/${bookId}/chapters/${chapterId}`);
    return response.data;
  },

  // Upload chapter PDF
  uploadChapterPDF: async (chapterId, file) => {
    const formData = createFormData({ pdf: file });
    const response = await axiosInstance.post(`/books/${bookId}/chapters/${chapterId}/pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get chapter content (for reading)
  getChapterContent: async (chapterId) => {
    const response = await axiosInstance.get(`/books/chapters/${chapterId}/content`);
    return response.data;
  },

  // Get all chapters for a book
  getBookChapters: async (bookId, params = {}) => {
    const response = await axiosInstance.get(`/books/${bookId}/chapters`, { params });
    return response.data;
  },

  // Reorder chapters (Author only)
  reorderChapters: async (bookId, chapterOrders) => {
    const response = await axiosInstance.put(`/books/${bookId}/chapters/reorder`, {
      orders: chapterOrders,
    });
    return response.data;
  },
};

export default chapterApi;

