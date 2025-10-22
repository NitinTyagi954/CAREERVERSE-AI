const mongoose = require('mongoose');

/**
 * User Schema - Stores user authentication and preferences
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  preferences: {
    minSalary: {
      type: Number,
      default: 30000,
      min: [0, 'Minimum salary cannot be negative']
    },
    companyType: {
      type: String,
      enum: ['any', 'well-known', 'startup'],
      default: 'any'
    },
    jobType: [{
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship']
    }],
    mode: {
      type: String,
      enum: ['job', 'freelance', 'both'],
      default: 'both'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster email lookups
// UserSchema.index({ email: 1 }); 

module.exports = mongoose.model('User', UserSchema);

