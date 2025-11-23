import axiosInstance from './axiosConfig';

const adminApi = {
  // Get all users (Admin only) - uses /users route with admin role check
  getAllUsers: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    console.log('📊 getAllUsers raw response:', response.data);
    // API returns array directly in data, wrap it for component consistency
    const rawUsers = Array.isArray(response.data.data) ? response.data.data : [];
    console.log('👥 Raw users count:', rawUsers.length);
    // Transform _id to id for component compatibility
    const users = rawUsers.map(user => ({
      ...user,
      id: user._id || user.id
    }));
    const result = {
      ...response.data,
      data: {
        users,
        pagination: response.data.pagination || {}
      }
    };
    console.log('✅ Transformed result:', result);
    return result;
  },

  // Get user by ID (Admin only)
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },

  // Update user (Admin only) - uses PATCH not PUT
  updateUser: async (userId, userData) => {
    const response = await axiosInstance.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId, data = {}) => {
    const response = await axiosInstance.delete(`/users/${userId}`, { data });
    return response.data;
  },

  // Get all books (Admin only) - uses /books route with role check
  getAllBooks: async (params = {}) => {
    const response = await axiosInstance.get('/books', { params });
    console.log('📚 getAllBooks raw response:', response.data);
    // Check if response already has books wrapped or is direct array
    if (response.data.data?.books) {
      // Transform _id to id
      const books = response.data.data.books.map(book => ({
        ...book,
        id: book._id || book.id
      }));
      const result = {
        ...response.data,
        data: {
          ...response.data.data,
          books
        }
      };
      console.log('✅ Transformed books result:', result);
      return result;
    }
    // If data is array directly, wrap it
    const rawBooks = Array.isArray(response.data.data) ? response.data.data : [];
    console.log('📖 Raw books count:', rawBooks.length);
    const books = rawBooks.map(book => ({
      ...book,
      id: book._id || book.id
    }));
    const result = {
      ...response.data,
      data: {
        books,
        pagination: response.data.pagination || {}
      }
    };
    console.log('✅ Transformed books result:', result);
    return result;
  },

  // Delete book (Admin only)
  deleteBook: async (bookId, data = {}) => {
    const response = await axiosInstance.delete(`/books/${bookId}`, { data });
    return response.data;
  },

  // Get admin analytics (comprehensive platform statistics)
  getAnalytics: async () => {
    const response = await axiosInstance.get('/admin/analytics');
    return response.data;
  },
};

export default adminApi;

