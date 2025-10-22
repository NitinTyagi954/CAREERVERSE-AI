const { asyncHandler } = require('../middleware/error.middleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserPreferences,
  updateUserProfile,
  deactivateUser
} = require('../services/auth.service');
const { validate } = require('../utils/validators');
const { registerSchema, loginSchema, preferencesSchema } = require('../utils/validators');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  
  res.json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user._id);
  
  res.json({
    success: true,
    data: user
  });
});

/**
 * Update user preferences
 * PUT /api/auth/preferences
 */
const updatePreferences = asyncHandler(async (req, res) => {
  const user = await updateUserPreferences(req.user._id, req.body);
  
  res.json({
    success: true,
    message: 'Preferences updated successfully',
    data: user
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body);
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

/**
 * Deactivate user account
 * DELETE /api/auth/profile
 */
const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await deactivateUser(req.user._id);
  
  res.json({
    success: true,
    message: 'Account deactivated successfully',
    data: user
  });
});

module.exports = {
  register: [validate(registerSchema), register],
  login: [validate(loginSchema), login],
  getProfile,
  updatePreferences: [validate(preferencesSchema), updatePreferences],
  updateProfile,
  deactivateAccount
};



