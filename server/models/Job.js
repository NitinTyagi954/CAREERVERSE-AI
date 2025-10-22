const mongoose = require('mongoose');

/**
 * Job Schema - Stores job listings from various sources
 */
const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  source: {
    type: String,
    required: [true, 'Job source is required'],
    enum: ['linkedin', 'indeed', 'glassdoor', 'naukri', 'monster', 'seed', 'manual'],
    default: 'manual'
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  salaryMin: {
    type: Number,
    min: [0, 'Minimum salary cannot be negative'],
    default: 0
  },
  salaryMax: {
    type: Number,
    min: [0, 'Maximum salary cannot be negative'],
    default: 0
  },
  salaryCurrency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  remote: {
    type: Boolean,
    default: false
  },
  jobType: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'remote', 'internship', 'contract', 'freelance'],
    default: 'full-time'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  reputationScore: {
    type: Number,
    min: [0, 'Reputation score cannot be negative'],
    max: [10, 'Reputation score cannot exceed 10'],
    default: 5
  },
  url: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'URL must start with http:// or https://']
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  requirements: {
    experience: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['years', 'months'],
        default: 'years'
      }
    },
    education: [String],
    skills: [String]
  },
  benefits: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
JobSchema.index({ source: 1, isActive: 1 });
JobSchema.index({ salaryMin: 1, salaryMax: 1 });
JobSchema.index({ jobType: 1, remote: 1 });
JobSchema.index({ tags: 1 });
JobSchema.index({ reputationScore: -1 });
JobSchema.index({ postedAt: -1 });

module.exports = mongoose.model('Job', JobSchema);


