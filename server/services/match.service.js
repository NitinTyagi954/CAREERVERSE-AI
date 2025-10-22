const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { AppError } = require('../middleware/error.middleware');

/**
 * Calculate skill match score between resume and job
 */
const calculateSkillScore = (resumeSkills, jobTags) => {
  if (!resumeSkills || !jobTags || resumeSkills.length === 0 || jobTags.length === 0) {
    return 0;
  }

  const resumeSkillsSet = new Set(resumeSkills.map(skill => skill.toLowerCase()));
  const jobTagsSet = new Set(jobTags.map(tag => tag.toLowerCase()));
  
  const matchedSkills = [...resumeSkillsSet].filter(skill => jobTagsSet.has(skill));
  
  return matchedSkills.length / Math.max(jobTags.length, 1);
};

/**
 * Calculate experience score based on job requirements and resume experience
 */
const calculateExperienceScore = (resumeExperience, jobRequirements) => {
  if (!resumeExperience || resumeExperience.length === 0) {
    return 0;
  }

  if (!jobRequirements || !jobRequirements.experience) {
    return 0.5; // Neutral score if no experience requirements
  }

  const { min: minExp, max: maxExp } = jobRequirements.experience;
  
  // Calculate total experience from resume
  let totalExperience = 0;
  resumeExperience.forEach(exp => {
    if (exp.start && exp.end) {
      const startDate = new Date(exp.start);
      const endDate = new Date(exp.end);
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      totalExperience += months / 12; // Convert to years
    }
  });

  // Score based on experience match
  if (minExp && totalExperience < minExp) {
    return Math.max(0, totalExperience / minExp);
  }
  
  if (maxExp && totalExperience > maxExp) {
    return Math.max(0, 1 - (totalExperience - maxExp) / maxExp);
  }

  return 1; // Perfect match
};

/**
 * Calculate salary score based on preferences
 */
const calculateSalaryScore = (jobSalary, preferences) => {
  const minSalary = preferences?.minSalary || 30000;
  
  if (!jobSalary || jobSalary.salaryMin < minSalary) {
    return 0;
  }
  
  // Higher salary gets better score
  const salaryRatio = jobSalary.salaryMin / minSalary;
  return Math.min(1, salaryRatio / 2); // Cap at 1, normalize by 2x minimum
};

/**
 * Calculate reputation boost score
 */
const calculateReputationScore = (reputationScore) => {
  if (!reputationScore) return 0;
  return reputationScore / 10; // Normalize to 0-1 scale
};

/**
 * Calculate remote work preference score
 */
const calculateRemoteScore = (jobRemote, preferences) => {
  const preferredJobTypes = preferences?.jobType || [];
  
  if (jobRemote && preferredJobTypes.includes('remote')) {
    return 1;
  }
  
  if (!jobRemote && preferredJobTypes.includes('remote')) {
    return 0.5; // Partial penalty for non-remote jobs when remote is preferred
  }
  
  return 0.8; // Neutral score
};

/**
 * Generate match explanation
 */
const generateMatchExplanation = (matchData) => {
  const { skillScore, experienceScore, salaryScore, reputationScore, matchedSkills } = matchData;
  
  let explanation = [];
  
  if (matchedSkills.length > 0) {
    explanation.push(`${matchedSkills.length} skill${matchedSkills.length > 1 ? 's' : ''} matched: ${matchedSkills.slice(0, 3).join(', ')}`);
  }
  
  if (experienceScore > 0.8) {
    explanation.push('Strong experience match');
  } else if (experienceScore > 0.5) {
    explanation.push('Good experience match');
  }
  
  if (salaryScore > 0.8) {
    explanation.push('Salary meets expectations');
  }
  
  if (reputationScore > 0.8) {
    explanation.push('Well-known company');
  }
  
  return explanation.join(' • ');
};

/**
 * Compute job matches for a resume
 */
const computeMatches = async (resume, preferences = {}, limit = 10) => {
  try {
    if (!resume) {
      throw new AppError('Resume is required for matching', 400);
    }

    // Get active jobs
    const jobs = await Job.find({ isActive: true }).lean();
    
    if (jobs.length === 0) {
      return [];
    }

    // Calculate matches
    const matches = jobs.map(job => {
      const skillScore = calculateSkillScore(resume.skills, job.tags);
      const experienceScore = calculateExperienceScore(resume.experience, job.requirements);
      const salaryScore = calculateSalaryScore(job, preferences);
      const reputationScore = calculateReputationScore(job.reputationScore);
      const remoteScore = calculateRemoteScore(job.remote, preferences);
      
      // Calculate final score with weights
      const finalScore = (
        skillScore * 0.4 +
        experienceScore * 0.2 +
        salaryScore * 0.15 +
        reputationScore * 0.15 +
        remoteScore * 0.1
      );

      // Find matched skills
      const resumeSkillsSet = new Set((resume.skills || []).map(skill => skill.toLowerCase()));
      const jobTagsSet = new Set((job.tags || []).map(tag => tag.toLowerCase()));
      const matchedSkills = [...resumeSkillsSet].filter(skill => jobTagsSet.has(skill));

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        source: job.source,
        score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
        matchedSkills: matchedSkills.slice(0, 10), // Limit to 10 skills
        reason: generateMatchExplanation({
          skillScore,
          experienceScore,
          salaryScore,
          reputationScore,
          matchedSkills
        }),
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        remote: job.remote,
        jobType: job.jobType,
        location: job.location,
        url: job.url,
        postedAt: job.postedAt,
        reputationScore: job.reputationScore
      };
    });

    // Sort by score descending and return top matches
    return matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .filter(match => match.score > 0.1); // Only return matches with score > 0.1

  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to compute job matches', 500);
  }
};

/**
 * Get job recommendations based on skills
 */
const getJobRecommendations = async (skills, preferences = {}, limit = 20) => {
  try {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      throw new AppError('Skills array is required', 400);
    }

    const normalizedSkills = skills.map(skill => skill.toLowerCase());
    
    // Find jobs with matching skills
    const jobs = await Job.find({
      isActive: true,
      tags: { $in: normalizedSkills }
    }).lean();

    // Calculate match scores
    const recommendations = jobs.map(job => {
      const jobTags = job.tags || [];
      const matchedSkills = jobTags.filter(tag => 
        normalizedSkills.includes(tag.toLowerCase())
      );
      
      const matchScore = matchedSkills.length / Math.max(normalizedSkills.length, 1);
      const salaryScore = calculateSalaryScore(job, preferences);
      const reputationScore = calculateReputationScore(job.reputationScore);
      
      const finalScore = matchScore * 0.7 + salaryScore * 0.2 + reputationScore * 0.1;

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        source: job.source,
        score: Math.round(finalScore * 100) / 100,
        matchedSkills: matchedSkills.slice(0, 10),
        reason: `${matchedSkills.length} skill${matchedSkills.length > 1 ? 's' : ''} matched`,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        remote: job.remote,
        jobType: job.jobType,
        location: job.location,
        url: job.url,
        postedAt: job.postedAt,
        reputationScore: job.reputationScore
      };
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to get job recommendations', 500);
  }
};

/**
 * Get top companies based on job matches
 */
const getTopCompanies = async (resume, preferences = {}, limit = 10) => {
  try {
    const matches = await computeMatches(resume, preferences, 50);
    
    // Group by company and calculate aggregate scores
    const companyMap = new Map();
    
    matches.forEach(match => {
      const company = match.company;
      if (!companyMap.has(company)) {
        companyMap.set(company, {
          company,
          totalJobs: 0,
          avgScore: 0,
          totalScore: 0,
          jobs: []
        });
      }
      
      const companyData = companyMap.get(company);
      companyData.totalJobs++;
      companyData.totalScore += match.score;
      companyData.avgScore = companyData.totalScore / companyData.totalJobs;
      companyData.jobs.push({
        title: match.title,
        score: match.score,
        jobType: match.jobType,
        remote: match.remote
      });
    });

    // Convert to array and sort by average score
    return Array.from(companyMap.values())
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, limit);

  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to get top companies', 500);
  }
};

module.exports = {
  computeMatches,
  getJobRecommendations,
  getTopCompanies,
  calculateSkillScore,
  calculateExperienceScore,
  calculateSalaryScore,
  calculateReputationScore,
  generateMatchExplanation
};



