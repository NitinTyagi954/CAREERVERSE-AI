const mongoose = require('mongoose');

/**
 * Gig Schema - Stores freelance gigs and tasks
 */
const GigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gig title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Gig category is required'],
    enum: [
      'data-entry', 'transcription', 'content-writing', 'graphic-design',
      'web-development', 'mobile-development', 'ai-training', 'data-labelling',
      'virtual-assistant', 'social-media', 'marketing', 'research',
      'translation', 'video-editing', 'photography', 'other'
    ],
    default: 'other'
  },
  description: {
    type: String,
    required: [true, 'Gig description is required'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  payMin: {
    type: Number,
    required: [true, 'Minimum pay is required'],
    min: [0, 'Minimum pay cannot be negative']
  },
  payMax: {
    type: Number,
    min: [0, 'Maximum pay cannot be negative'],
    default: 0
  },
  payCurrency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR', 'GBP']
  },
  payType: {
    type: String,
    enum: ['hourly', 'fixed', 'per-task', 'per-word', 'per-page'],
    default: 'fixed'
  },
  durationWeeks: {
    type: Number,
    min: [1, 'Duration must be at least 1 week'],
    max: [52, 'Duration cannot exceed 52 weeks'],
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  source: {
    type: String,
    required: [true, 'Gig source is required'],
    enum: ['upwork', 'fiverr', 'freelancer', 'seed', 'manual'],
    default: 'manual'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  requirements: {
    skills: [String],
    experience: String,
    portfolio: Boolean,
    certification: Boolean
  },
  url: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'URL must start with http:// or https://']
  },
  clientInfo: {
    name: String,
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    reviews: Number,
    verified: Boolean
  },
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
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
GigSchema.index({ category: 1, isActive: 1 });
GigSchema.index({ payMin: 1, payMax: 1 });
GigSchema.index({ difficulty: 1 });
GigSchema.index({ tags: 1 });
GigSchema.index({ postedAt: -1 });

module.exports = mongoose.model('Gig', GigSchema);


