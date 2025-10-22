const { asyncHandler } = require('../middleware/error.middleware');
const { AppError } = require('../middleware/error.middleware');
const Resume = require('../models/Resume');
const { upload, deleteFile, getFileStats } = require('../services/file.service');
const { parseResumeFile } = require('../services/resumeParser.service');

/**
 * Upload and parse resume
 * POST /api/resume/upload
 */
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const { originalname, mimetype, size, path: filePath } = req.file;

  try {
    // Parse the resume file
    const parsedData = await parseResumeFile(filePath, mimetype);

    // Create resume record in database
    const resume = await Resume.create({
      userId: req.user._id,
      filePath: filePath,
      originalFileName: originalname,
      fileSize: size,
      mimeType: mimetype,
      text: parsedData.text,
      skills: parsedData.skills,
      education: parsedData.education,
      experience: parsedData.experience,
      isParsed: parsedData.isParsed,
      parseError: parsedData.parseError
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      data: resume
    });
  } catch (error) {
    // Clean up uploaded file if parsing fails
    await deleteFile(filePath);
    throw error;
  }
});

/**
 * Get user's resumes
 * GET /api/resume
 */
const getResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .select('-text') // Exclude full text for list view
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: resumes
  });
});

/**
 * Get specific resume by ID
 * GET /api/resume/:id
 */
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  res.json({
    success: true,
    data: resume
  });
});

/**
 * Update resume data (for manual editing)
 * PUT /api/resume/:id
 */
const updateResume = asyncHandler(async (req, res) => {
  const { skills, education, experience } = req.body;

  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      skills: skills || [],
      education: education || [],
      experience: experience || [],
      isParsed: true,
      parseError: null
    },
    { new: true, runValidators: true }
  );

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  res.json({
    success: true,
    message: 'Resume updated successfully',
    data: resume
  });
});

/**
 * Delete resume
 * DELETE /api/resume/:id
 */
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  // Delete file from filesystem
  await deleteFile(resume.filePath);

  // Delete resume record
  await Resume.findByIdAndDelete(resume._id);

  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
});

/**
 * Get resume statistics
 * GET /api/resume/stats
 */
const getResumeStats = asyncHandler(async (req, res) => {
  const stats = await Resume.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        totalResumes: { $sum: 1 },
        parsedResumes: {
          $sum: { $cond: [{ $eq: ['$isParsed', true] }, 1, 0] }
        },
        totalSkills: { $sum: { $size: '$skills' } },
        avgSkills: { $avg: { $size: '$skills' } }
      }
    }
  ]);

  const result = stats[0] || {
    totalResumes: 0,
    parsedResumes: 0,
    totalSkills: 0,
    avgSkills: 0
  };

  res.json({
    success: true,
    data: result
  });
});

module.exports = {
  uploadResume: [upload.single('resume'), uploadResume],
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  getResumeStats
};



