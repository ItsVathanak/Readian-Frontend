// Handle file uploads with FormData
export const createFormData = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return formData;
};

// Build query string from params
export const buildQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return new URLSearchParams(filtered).toString();
};

// Handle paginated responses
export const extractPaginationData = (response) => {
  return {
    data: response.data.data,
    pagination: response.data.pagination || null,
  };
};

