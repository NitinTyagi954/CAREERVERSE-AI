const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const {
  getGigs,
  getGig,
  seedGigs,
  getGigStats,
  searchGigsBySkills
} = require('../controllers/freelance.controller');

// Public routes
router.get('/', getGigs);
// Place /stats BEFORE /:id to prevent parameter matching
router.get('/stats', getGigStats);
router.get('/:id', getGig);

// Protected routes
router.post('/search-by-skills', authMiddleware, searchGigsBySkills);

// Admin routes
router.post('/seed', adminMiddleware, seedGigs);

module.exports = router;



