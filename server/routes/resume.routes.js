const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  uploadResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  getResumeStats
} = require('../controllers/resume.controller');

// All resume routes require authentication
router.use(authMiddleware);

router.post('/upload', uploadResume);
router.get('/', getResumes);
router.get('/stats', getResumeStats);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;



