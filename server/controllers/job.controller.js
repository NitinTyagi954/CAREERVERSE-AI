const { asyncHandler } = require('../middleware/error.middleware');
const { AppError } = require('../middleware/error.middleware');

const mockJobs = [
  {
    id: 'job-1',
    title: 'Senior React Developer',
    company: 'TechCorp India',
    location: 'Bangalore, India',
    salary: '12-18 LPA',
    jobType: 'Full-time',
    remote: 'hybrid',
    companyType: 'Product',
    tags: ['React', 'Node.js', 'AWS'],
    platform: 'LinkedIn',
    posted: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'Frontend Intern',
    company: 'StartupXYZ',
    location: 'Delhi, India',
    salary: '3-5 LPA',
    jobType: 'Internship',
    remote: 'remote',
    companyType: 'Startup',
    tags: ['React', 'JavaScript'],
    platform: 'Internshala',
    posted: '1 day ago'
  },
  {
    id: 'job-3',
    title: 'Full Stack Developer',
    company: 'Enterprise Ltd',
    location: 'Hyderabad, India',
    salary: '8-12 LPA',
    jobType: 'Full-time',
    remote: 'office',
    companyType: 'Enterprise',
    tags: ['React', 'Node.js'],
    platform: 'Indeed',
    posted: '3 days ago'
  },
  {
    id: 'job-4',
    title: 'JavaScript Developer',
    company: 'WebDev Agency',
    location: 'Mumbai, India',
    salary: '6-9 LPA',
    jobType: 'Full-time',
    remote: 'hybrid',
    companyType: 'Agency',
    tags: ['JavaScript', 'Vue.js'],
    platform: 'LinkedIn',
    posted: '4 days ago'
  },
  {
    id: 'job-5',
    title: 'Backend Engineer',
    company: 'AI Innovations',
    location: 'Bangalore, India',
    salary: '10-15 LPA',
    jobType: 'Full-time',
    remote: 'remote',
    companyType: 'Product',
    tags: ['Python', 'Django'],
    platform: 'Internshala',
    posted: '5 days ago'
  }
];

const getJobs = asyncHandler(async (req, res) => {
  const { q = '', jobType = '', remote = '', companyType = '', platform = '', page = 1, limit = 10 } = req.query;

  let filteredJobs = mockJobs.filter(job => {
    if (q) {
      const searchLower = q.toLowerCase();
      if (!job.title.toLowerCase().includes(searchLower) && !job.company.toLowerCase().includes(searchLower)) return false;
    }
    if (jobType && job.jobType !== jobType) return false;
    if (remote && job.remote !== remote) return false;
    if (companyType && job.companyType !== companyType) return false;
    if (platform && job.platform !== platform) return false;
    return true;
  });

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(50, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  const totalJobs = filteredJobs.length;
  const totalPages = Math.ceil(totalJobs / limitNum) || 1;
  const paginatedJobs = filteredJobs.slice(skip, skip + limitNum);

  res.json({
    success: true,
    data: {
      jobs: paginatedJobs,
      pagination: { currentPage: pageNum, pageSize: limitNum, totalJobs, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 }
    }
  });
});

const getJobById = asyncHandler(async (req, res) => {
  const job = mockJobs.find(j => j.id === req.params.id);
  if (!job) throw new AppError('Job not found', 404);
  res.json({ success: true, data: job });
});

const saveJob = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new AppError('User not authenticated', 401);
  const job = mockJobs.find(j => j.id === req.params.id);
  if (!job) throw new AppError('Job not found', 404);
  res.json({ success: true, message: 'Job saved', data: { jobId: req.params.id, savedAt: new Date() } });
});

const applyForJob = asyncHandler(async (req, res) => {
  if (!req.user?._id) throw new AppError('User not authenticated', 401);
  const job = mockJobs.find(j => j.id === req.params.id);
  if (!job) throw new AppError('Job not found', 404);
  res.json({ success: true, message: 'Application submitted', data: { jobId: req.params.id, status: 'pending' } });
});

module.exports = { getJobs, getJobById, saveJob, applyForJob };

