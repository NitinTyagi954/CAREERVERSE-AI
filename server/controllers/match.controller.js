const { asyncHandler } = require('../middleware/error.middleware');
const { AppError } = require('../middleware/error.middleware');
const Resume = require('../models/Resume');
const { computeMatches, getJobRecommendations, getTopCompanies } = require('../services/match.service');
const { validate } = require('../utils/validators');
const { matchSchema } = require('../utils/validators');

/**
 * Get job matches for a resume
 * GET /api/match/:resumeId or POST /api/match
 */
const getMatches = asyncHandler(async (req, res) => {
  // Support both GET (from params) and POST (from body)
  const resumeId = req.params.resumeId || req.body.resumeId;
  const preferences = req.body.preferences;
  const limit = req.body.limit || 10;

  if (!resumeId) {
    throw new AppError('Resume ID is required', 400);
  }

  // Get resume
  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  // Compute matches
  const matches = await computeMatches(resume, preferences, limit);

  res.json({
    success: true,
    data: {
      matches,
      totalMatches: matches.length,
      resumeId: resume._id,
      preferences: preferences || req.user.preferences
    }
  });
});

/**
 * Get job recommendations based on skills
 * POST /api/match/recommendations
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const { skills, preferences, limit = 20 } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new AppError('Skills array is required', 400);
  }

  const recommendations = await getJobRecommendations(skills, preferences, limit);

  res.json({
    success: true,
    data: {
      recommendations,
      totalRecommendations: recommendations.length,
      skills: skills
    }
  });
});

/**
 * Get top companies based on resume matches
 * POST /api/match/companies
 */
const getTopCompaniesForResume = asyncHandler(async (req, res) => {
  const { resumeId, preferences, limit = 10 } = req.body;

  // Get resume
  const resume = await Resume.findOne({
    _id: resumeId,
    userId: req.user._id
  });

  if (!resume) {
    throw new AppError('Resume not found', 404);
  }

  const companies = await getTopCompanies(resume, preferences, limit);

  res.json({
    success: true,
    data: {
      companies,
      totalCompanies: companies.length,
      resumeId: resume._id
    }
  });
});

/**
 * Get match statistics for user
 * GET /api/match/stats
 */
const getMatchStats = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id });
  
  let totalMatches = 0;
  let avgScore = 0;
  let skillDistribution = {};
  
  for (const resume of resumes) {
    const matches = await computeMatches(resume, req.user.preferences, 50);
    totalMatches += matches.length;
    
    if (matches.length > 0) {
      const scores = matches.map(m => m.score);
      avgScore += scores.reduce((a, b) => a + b, 0) / scores.length;
    }
    
    // Count skills across all resumes
    resume.skills.forEach(skill => {
      skillDistribution[skill] = (skillDistribution[skill] || 0) + 1;
    });
  }
  
  avgScore = resumes.length > 0 ? avgScore / resumes.length : 0;
  
  // Get top skills
  const topSkills = Object.entries(skillDistribution)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  res.json({
    success: true,
    data: {
      totalResumes: resumes.length,
      totalMatches,
      avgScore: Math.round(avgScore * 100) / 100,
      topSkills,
      skillDistribution
    }
  });
});

module.exports = {
  getMatches,
  getRecommendations,
  getTopCompaniesForResume,
  getMatchStats
};



