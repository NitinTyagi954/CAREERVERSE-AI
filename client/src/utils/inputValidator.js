/**
 * Input Validation Utilities
 * Provides consistent input validation and sanitization
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 * Minimum: 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = []

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate name format
 * @param {string} name - Name to validate
 * @returns {boolean}
 */
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100
}

/**
 * Sanitize string input (remove XSS attempts)
 * @param {string} input - String to sanitize
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
}

/**
 * Sanitize HTML content
 * @param {string} html - HTML string to sanitize
 * @returns {string}
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') {
    return ''
  }

  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number (basic international format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSizeMB = 5) => {
  return file && file.size <= maxSizeMB * 1024 * 1024
}

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean}
 */
export const isValidFileType = (file, allowedTypes = []) => {
  return file && allowedTypes.includes(file.type)
}

/**
 * Validate file extension
 * @param {File} file - File to validate
 * @param {string[]} allowedExtensions - Allowed file extensions (without dot)
 * @returns {boolean}
 */
export const isValidFileExtension = (file, allowedExtensions = []) => {
  if (!file) return false
  const fileName = file.name.toLowerCase()
  return allowedExtensions.some(ext => fileName.endsWith(`.${ext.toLowerCase()}`))
}

/**
 * Validate required fields
 * @param {Object} data - Object with fields to validate
 * @param {string[]} requiredFields - Array of required field names
 * @returns {Object} - { isValid: boolean, missingFields: string[] }
 */
export const validateRequiredFields = (data, requiredFields = []) => {
  const missingFields = requiredFields.filter(
    field => !data[field] || (typeof data[field] === 'string' && !data[field].trim())
  )

  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateForm = (data, schema) => {
  const errors = {}

  Object.keys(schema).forEach(field => {
    const validator = schema[field]
    const value = data[field]

    if (validator.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = validator.requiredMessage || `${field} is required`
      return
    }

    if (validator.validate && !validator.validate(value)) {
      errors[field] = validator.message || `${field} is invalid`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  isValidEmail,
  validatePassword,
  isValidName,
  sanitizeInput,
  sanitizeHtml,
  isValidUrl,
  isValidPhone,
  isValidFileSize,
  isValidFileType,
  isValidFileExtension,
  validateRequiredFields,
  validateForm
}
