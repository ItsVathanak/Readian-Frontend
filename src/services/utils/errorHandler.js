import toast from 'react-hot-toast';

// Map error codes to user-friendly messages
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Please check your input and try again',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  AGE_RESTRICTED: 'This content is restricted to users 18 and older',
  SUBSCRIPTION_REQUIRED: 'This feature requires a Premium subscription',
  EMAIL_NOT_VERIFIED: 'Please verify your email to continue',
  NETWORK_ERROR: 'Network error. Please check your connection',
};

export const handleApiError = (error, showToast = true) => {
  let message = error.message || 'Something went wrong';

  // Use custom message if error code exists
  if (error.code && ERROR_MESSAGES[error.code]) {
    message = ERROR_MESSAGES[error.code];
  }

  // Show validation errors if present
  if (error.errors && Array.isArray(error.errors)) {
    message = error.errors.map(err => err.msg).join(', ');
  }

  if (showToast) {
    toast.error(message);
  }

  return message;
};

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

