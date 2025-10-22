const Joi = require('joi');

/**
 * Validation schemas for request bodies
 */

// User registration validation
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  password: Joi.string().min(6).max(128).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password cannot exceed 128 characters'
    })
});

// User login validation
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// User preferences validation
const preferencesSchema = Joi.object({
  minSalary: Joi.number().min(0).max(10000000).optional(),
  companyType: Joi.string().valid('any', 'well-known', 'startup').optional(),
  jobType: Joi.array().items(
    Joi.string().valid('full-time', 'part-time', 'remote', 'internship')
  ).optional(),
  mode: Joi.string().valid('job', 'freelance', 'both').optional()
});

// Job query validation
const jobQuerySchema = Joi.object({
  source: Joi.string().valid('linkedin', 'indeed', 'glassdoor', 'naukri', 'monster', 'seed', 'manual').optional(),
  minSalary: Joi.number().min(0).optional(),
  maxSalary: Joi.number().min(0).optional(),
  jobType: Joi.string().valid('full-time', 'part-time', 'remote', 'internship', 'contract', 'freelance').optional(),
  remote: Joi.boolean().optional(),
  companyType: Joi.string().valid('any', 'well-known', 'startup').optional(),
  q: Joi.string().trim().max(200).optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(20).optional()
});

// Gig query validation
const gigQuerySchema = Joi.object({
  category: Joi.string().valid(
    'data-entry', 'transcription', 'content-writing', 'graphic-design',
    'web-development', 'mobile-development', 'ai-training', 'data-labelling',
    'virtual-assistant', 'social-media', 'marketing', 'research',
    'translation', 'video-editing', 'photography', 'other'
  ).optional(),
  payMin: Joi.number().min(0).optional(),
  payMax: Joi.number().min(0).optional(),
  difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'expert').optional(),
  durationWeeks: Joi.number().min(1).max(52).optional(),
  page: Joi.number().min(1).default(1).optional(),
  limit: Joi.number().min(1).max(100).default(20).optional()
});

// Matching request validation
const matchSchema = Joi.object({
  resumeId: Joi.string().hex().length(24).required()
    .messages({
      'string.empty': 'Resume ID is required',
      'string.hex': 'Resume ID must be a valid MongoDB ObjectId',
      'string.length': 'Resume ID must be 24 characters long'
    }),
  preferences: preferencesSchema.optional(),
  limit: Joi.number().min(1).max(50).default(10).optional()
});

// Application draft validation
const applicationDraftSchema = Joi.object({
  jobId: Joi.string().hex().length(24).optional(),
  gigId: Joi.string().hex().length(24).optional(),
  applicationType: Joi.string().valid('job', 'freelance', 'template').required(),
  platform: Joi.string().trim().max(100).optional(),
  isTemplate: Joi.boolean().optional(),
  fields: Joi.object({
    name: Joi.string().trim().max(100).optional(),
    email: Joi.string().email().trim().optional(),
    phone: Joi.string().trim().max(20).optional(),
    resumePath: Joi.string().trim().optional(),
    coverLetter: Joi.string().max(2000).optional(),
    portfolio: Joi.string().uri().optional(),
    linkedin: Joi.string().uri().optional(),
    github: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    experience: Joi.string().max(1000).optional(),
    skills: Joi.array().items(Joi.string().trim()).optional(),
    availability: Joi.string().valid('immediate', '1-week', '2-weeks', '1-month', 'flexible').optional(),
    expectedSalary: Joi.number().min(0).optional(),
    customFields: Joi.object().pattern(Joi.string(), Joi.string()).optional()
  }).optional()
});

/**
 * Validation middleware factory
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages
      });
    }
    
    req.body = value;
    next();
  };
};

/**
 * Query validation middleware factory
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors: errorMessages
      });
    }
    
    req.query = value;
    next();
  };
};

module.exports = {
  registerSchema,
  loginSchema,
  preferencesSchema,
  jobQuerySchema,
  gigQuerySchema,
  matchSchema,
  applicationDraftSchema,
  validate,
  validateQuery
};


