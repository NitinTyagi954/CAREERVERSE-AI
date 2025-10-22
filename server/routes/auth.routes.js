const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  register,
  login,
  getProfile,
  updatePreferences,
  updateProfile,
  deactivateAccount
} = require('../controllers/auth.controller');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(authMiddleware); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/preferences', updatePreferences);
router.put('/profile', updateProfile);
router.delete('/profile', deactivateAccount);

module.exports = router;



