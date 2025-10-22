const mongoose = require('mongoose');

/**
 * Resume Schema - Stores parsed resume data
 */
const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    min: [1950, 'Year must be after 1950'],
    max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in future']
  },
  gpa: {
    type: String,
    trim: true
  }
});

const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    default: null // null means current position
  },
  bullets: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  }
});

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  parsedAt: {
    type: Date,
    default: Date.now
  },
  isParsed: {
    type: Boolean,
    default: false
  },
  parseError: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster user-based queries
ResumeSchema.index({ userId: 1 });
ResumeSchema.index({ parsedAt: -1 });

module.exports = mongoose.model('Resume', ResumeSchema);

