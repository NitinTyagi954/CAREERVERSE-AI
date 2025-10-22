/**
 * Centralized error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    error = {
      success: false,
      message: 'Validation Error',
      errors: errors
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      success: false,
      message: `${field} already exists`
    };
    return res.status(400).json(error);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = {
      success: false,
      message: 'Invalid ID format'
    };
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      message: 'Invalid token'
    };
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      message: 'Token expired'
    };
    return res.status(401).json(error);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      success: false,
      message: 'File too large. Maximum size is 5MB'
    };
    return res.status(400).json(error);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = {
      success: false,
      message: 'Too many files uploaded'
    };
    return res.status(400).json(error);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      success: false,
      message: 'Unexpected field name'
    };
    return res.status(400).json(error);
  }

  // Custom application errors
  if (err.isOperational) {
    error = {
      success: false,
      message: err.message,
      ...(err.details && { details: err.details })
    };
    return res.status(err.statusCode || 400).json(error);
  }

  // Default to 500 server error
  res.status(500).json(error);
};

/**
 * 404 handler for undefined routes
 */
const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorMiddleware,
  notFoundMiddleware,
  asyncHandler,
  AppError
};


