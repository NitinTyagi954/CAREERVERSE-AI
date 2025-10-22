const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const { AppError } = require('../middleware/error.middleware');

/**
 * Configure multer storage
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    
    try {
      // Create upload directory if it doesn't exist
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(new AppError('Failed to create upload directory', 500));
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

/**
 * File filter to allow only specific file types
 */
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(
      'Invalid file type. Only PDF and DOCX files are allowed.',
      400
    ), false);
  }
};

/**
 * Configure multer upload middleware
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file at a time
  }
});

/**
 * Delete file from filesystem
 */
const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Check if file exists
 */
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get file stats
 */
const getFileStats = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    };
  } catch (error) {
    throw new AppError('Failed to get file information', 500);
  }
};

/**
 * Validate file size
 */
const validateFileSize = (fileSize, maxSize = 5 * 1024 * 1024) => {
  if (fileSize > maxSize) {
    throw new AppError(
      `File size exceeds limit. Maximum allowed: ${maxSize / (1024 * 1024)}MB`,
      400
    );
  }
  return true;
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Get MIME type from file extension
 */
const getMimeTypeFromExtension = (extension) => {
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

/**
 * Sanitize filename to prevent path traversal attacks
 */
const sanitizeFilename = (filename) => {
  // Remove any path separators and dangerous characters
  return filename
    .replace(/[\/\\:*?"<>|]/g, '_')
    .replace(/\.\./g, '_')
    .trim();
};

/**
 * Generate safe filename
 */
const generateSafeFilename = (originalName) => {
  const sanitized = sanitizeFilename(originalName);
  const extension = path.extname(sanitized);
  const baseName = path.basename(sanitized, extension);
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${baseName}_${uniqueId}${extension}`;
};

module.exports = {
  upload,
  deleteFile,
  fileExists,
  getFileStats,
  validateFileSize,
  getFileExtension,
  getMimeTypeFromExtension,
  sanitizeFilename,
  generateSafeFilename
};


