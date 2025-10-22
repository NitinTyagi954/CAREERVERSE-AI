const mongoose = require('mongoose');

/**
 * ApplicationDraft Schema - Stores pre-filled application forms
 */
const ApplicationDraftSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: false // Can be null for general templates
  },
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: false // Can be null for general templates
  },
  fields: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    resumePath: {
      type: String,
      trim: true
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
    },
    portfolio: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      maxlength: [1000, 'Experience description cannot exceed 1000 characters']
    },
    skills: [String],
    availability: {
      type: String,
      enum: ['immediate', '1-week', '2-weeks', '1-month', 'flexible'],
      default: 'flexible'
    },
    expectedSalary: {
      type: Number,
      min: [0, 'Expected salary cannot be negative']
    },
    customFields: {
      type: Map,
      of: String
    }
  },
  applicationType: {
    type: String,
    enum: ['job', 'freelance', 'template'],
    required: true,
    default: 'template'
  },
  platform: {
    type: String,
    trim: true,
    lowercase: true
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
ApplicationDraftSchema.index({ userId: 1, applicationType: 1 });
ApplicationDraftSchema.index({ jobId: 1 });
ApplicationDraftSchema.index({ gigId: 1 });
ApplicationDraftSchema.index({ isTemplate: 1, isActive: 1 });

module.exports = mongoose.model('ApplicationDraft', ApplicationDraftSchema);


