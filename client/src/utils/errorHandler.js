/**
 * Error Handler Utilities
 * Provides consistent error handling across the application
 */

/**
 * Extract error message from different error types
 * @param {Error|Object} error - Error object from axios, try-catch, or other sources
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Axios error with response
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  // Axios error with status
  if (error?.response?.status) {
    const statusMessages = {
      400: 'Bad request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'Forbidden. You do not have permission.',
      404: 'Resource not found.',
      409: 'Conflict. This resource already exists.',
      422: 'Validation error. Please check your input.',
      500: 'Server error. Please try again later.',
      503: 'Service unavailable. Please try again later.'
    }
    return statusMessages[error.response.status] || 'An error occurred.'
  }

  // Network error
  if (error?.message === 'Network Error' || error?.code === 'ECONNABORTED') {
    return 'Network error. Please check your connection.'
  }

  // Timeout error
  if (error?.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.'
  }

  // Generic error message
  if (error?.message) {
    return error.message
  }

  // Fallback
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Check if error is a network error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return (
    error?.message === 'Network Error' ||
    error?.code === 'ECONNABORTED' ||
    error?.code === 'ENOTFOUND' ||
    error?.code === 'ENETUNREACH'
  )
}

/**
 * Check if error is an authentication error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401
}

/**
 * Check if error is a validation error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return error?.response?.status === 422 || error?.response?.status === 400
}

/**
 * Check if error is a conflict error (duplicate resource)
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isConflictError = (error) => {
  return error?.response?.status === 409
}

/**
 * Check if error is a server error
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export const isServerError = (error) => {
  return (
    error?.response?.status === 500 ||
    error?.response?.status === 502 ||
    error?.response?.status === 503 ||
    error?.response?.status === 504
  )
}

/**
 * Log error with context for debugging
 * @param {string} context - Where the error occurred (component name, function name)
 * @param {Error} error - Error object
 * @param {Object} additionalData - Additional data to log
 */
export const logError = (context, error, additionalData = {}) => {
  const timestamp = new Date().toISOString()
  const errorLog = {
    timestamp,
    context,
    message: getErrorMessage(error),
    status: error?.response?.status,
    url: error?.response?.config?.url,
    additionalData
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, errorLog)
  }

  // TODO: Send to error tracking service (e.g., Sentry) in production
}

/**
 * Retry failed API calls with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delayMs - Initial delay in milliseconds
 * @returns {Promise} - Result of function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, delayMs = 1000) => {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // Don't retry on certain errors
      if (isAuthError(error) || isValidationError(error)) {
        throw error
      }

      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        const waitTime = delayMs * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError
}

export default {
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isValidationError,
  isConflictError,
  isServerError,
  logError,
  retryWithBackoff
}
