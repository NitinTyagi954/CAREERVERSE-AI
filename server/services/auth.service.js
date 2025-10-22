const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/error.middleware');

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Register a new user
 */
const registerUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password hash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return {
      user: userResponse,
      token
    };
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to register user', 500);
  }
};

/**
 * Login user
 */
const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password hash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    return {
      user: userResponse,
      token
    };
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to login user', 500);
  }
};

/**
 * Get user profile
 */
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to get user profile', 500);
  }
};

/**
 * Update user preferences
 */
const updateUserPreferences = async (userId, preferences) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { preferences },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to update user preferences', 500);
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, updateData) => {
  try {
    // Remove sensitive fields that shouldn't be updated directly
    const { password, passwordHash, ...safeUpdateData } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      safeUpdateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to update user profile', 500);
  }
};

/**
 * Deactivate user account
 */
const deactivateUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to deactivate user', 500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserPreferences,
  updateUserProfile,
  deactivateUser,
  generateToken,
  hashPassword,
  comparePassword
};


