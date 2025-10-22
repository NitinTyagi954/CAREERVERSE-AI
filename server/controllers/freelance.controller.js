const { asyncHandler } = require('../middleware/error.middleware');
const { AppError } = require('../middleware/error.middleware');
const Gig = require('../models/Gig');
const { validateQuery } = require('../utils/validators');
const { gigQuerySchema } = require('../utils/validators');

/**
 * Get freelance gigs with filtering and pagination
 * GET /api/gigs
 */
const getGigs = asyncHandler(async (req, res) => {
  const {
    category,
    payMin,
    payMax,
    difficulty,
    durationWeeks,
    page = 1,
    limit = 20
  } = req.query;

  // Build filter object
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (durationWeeks) filter.durationWeeks = { $lte: parseInt(durationWeeks) };

  // Pay range filter
  if (payMin || payMax) {
    filter.$or = [];
    if (payMin) {
      filter.$or.push({ payMin: { $gte: parseInt(payMin) } });
    }
    if (payMax) {
      filter.$or.push({ payMax: { $lte: parseInt(payMax) } });
    }
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const [gigs, total] = await Promise.all([
    Gig.find(filter)
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Gig.countDocuments(filter)
  ]);

  // Calculate pagination info
  const totalPages = Math.ceil(total / parseInt(limit));
  const hasNext = parseInt(page) < totalPages;
  const hasPrev = parseInt(page) > 1;

  res.json({
    success: true,
    data: {
      gigs,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalGigs: total,
        hasNext,
        hasPrev,
        limit: parseInt(limit)
      }
    }
  });
});

/**
 * Get gig by ID
 * GET /api/gigs/:id
 */
const getGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig || !gig.isActive) {
    throw new AppError('Gig not found', 404);
  }

  res.json({
    success: true,
    data: gig
  });
});

/**
 * Seed sample gigs (admin only)
 * POST /api/gigs/seed
 */
const seedGigs = asyncHandler(async (req, res) => {
  const sampleGigs = require('../utils/sample-gigs.json');
  
  // Clear existing seed gigs
  await Gig.deleteMany({ source: 'seed' });

  // Insert sample gigs
  const gigs = await Gig.insertMany(sampleGigs);

  res.json({
    success: true,
    message: `${gigs.length} sample gigs seeded successfully`,
    data: { count: gigs.length }
  });
});

/**
 * Get gig statistics
 * GET /api/gigs/stats
 */
const getGigStats = asyncHandler(async (req, res) => {
  const stats = await Gig.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalGigs: { $sum: 1 },
        avgPay: { $avg: '$payMin' },
        maxPay: { $max: '$payMax' },
        minPay: { $min: '$payMin' },
        byCategory: {
          $push: '$category'
        },
        byDifficulty: {
          $push: '$difficulty'
        },
        byPayType: {
          $push: '$payType'
        }
      }
    }
  ]);

  const result = stats[0] || {
    totalGigs: 0,
    avgPay: 0,
    maxPay: 0,
    minPay: 0,
    byCategory: [],
    byDifficulty: [],
    byPayType: []
  };

  // Count by category
  const categoryCount = result.byCategory.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Count by difficulty
  const difficultyCount = result.byDifficulty.reduce((acc, difficulty) => {
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

  // Count by pay type
  const payTypeCount = result.byPayType.reduce((acc, payType) => {
    acc[payType] = (acc[payType] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      ...result,
      categoryCount,
      difficultyCount,
      payTypeCount,
      byCategory: undefined,
      byDifficulty: undefined,
      byPayType: undefined
    }
  });
});

/**
 * Search gigs by skills
 * POST /api/gigs/search-by-skills
 */
const searchGigsBySkills = asyncHandler(async (req, res) => {
  const { skills, limit = 20 } = req.body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    throw new AppError('Skills array is required', 400);
  }

  // Convert skills to lowercase for matching
  const normalizedSkills = skills.map(skill => skill.toLowerCase());

  // Find gigs that have matching skills in tags
  const gigs = await Gig.find({
    isActive: true,
    tags: { $in: normalizedSkills }
  })
    .sort({ postedAt: -1 })
    .limit(parseInt(limit))
    .lean();

  // Calculate match scores
  const gigsWithScores = gigs.map(gig => {
    const gigTags = gig.tags || [];
    const matchedSkills = gigTags.filter(skill => 
      normalizedSkills.includes(skill.toLowerCase())
    );
    const matchScore = matchedSkills.length / Math.max(normalizedSkills.length, 1);

    return {
      ...gig,
      matchScore,
      matchedSkills
    };
  });

  // Sort by match score
  gigsWithScores.sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    success: true,
    data: gigsWithScores
  });
});

module.exports = {
  getGigs: [validateQuery(gigQuerySchema), getGigs],
  getGig,
  seedGigs,
  getGigStats,
  searchGigsBySkills
};



