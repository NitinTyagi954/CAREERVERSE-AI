const express = require('express');
const router = express.Router();
const { getJobs, getJobById, saveJob, applyForJob } = require('../controllers/job.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/:id/save', authMiddleware, saveJob);
router.post('/:id/apply', authMiddleware, applyForJob);

module.exports = router;



