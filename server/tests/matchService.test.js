const {
  calculateSkillScore,
  calculateExperienceScore,
  calculateSalaryScore,
  calculateReputationScore,
  generateMatchExplanation
} = require('../services/match.service');

describe('Match Service', () => {
  describe('calculateSkillScore', () => {
    test('should calculate skill score correctly', () => {
      const resumeSkills = ['react', 'javascript', 'node.js'];
      const jobTags = ['react', 'javascript', 'css', 'html'];
      
      const score = calculateSkillScore(resumeSkills, jobTags);
      expect(score).toBe(0.5); // 2 matches out of 4 job tags
    });

    test('should return 0 for no matches', () => {
      const resumeSkills = ['python', 'java'];
      const jobTags = ['react', 'javascript'];
      
      const score = calculateSkillScore(resumeSkills, jobTags);
      expect(score).toBe(0);
    });

    test('should handle empty arrays', () => {
      expect(calculateSkillScore([], [])).toBe(0);
      expect(calculateSkillScore(null, null)).toBe(0);
    });
  });

  describe('calculateExperienceScore', () => {
    test('should calculate experience score for matching experience', () => {
      const resumeExperience = [
        {
          start: new Date('2020-01-01'),
          end: new Date('2022-01-01')
        }
      ];
      const jobRequirements = {
        experience: { min: 1, max: 3, unit: 'years' }
      };
      
      const score = calculateExperienceScore(resumeExperience, jobRequirements);
      expect(score).toBe(1); // Perfect match
    });

    test('should return neutral score for no requirements', () => {
      const resumeExperience = [
        {
          start: new Date('2020-01-01'),
          end: new Date('2022-01-01')
        }
      ];
      
      const score = calculateExperienceScore(resumeExperience, null);
      expect(score).toBe(0.5);
    });

    test('should handle empty experience', () => {
      const score = calculateExperienceScore([], { experience: { min: 1 } });
      expect(score).toBe(0);
    });
  });

  describe('calculateSalaryScore', () => {
    test('should return 1 for salary above minimum', () => {
      const jobSalary = { salaryMin: 50000 };
      const preferences = { minSalary: 30000 };
      
      const score = calculateSalaryScore(jobSalary, preferences);
      expect(score).toBeGreaterThan(0);
    });

    test('should return 0 for salary below minimum', () => {
      const jobSalary = { salaryMin: 20000 };
      const preferences = { minSalary: 30000 };
      
      const score = calculateSalaryScore(jobSalary, preferences);
      expect(score).toBe(0);
    });

    test('should use default minimum salary', () => {
      const jobSalary = { salaryMin: 40000 };
      const score = calculateSalaryScore(jobSalary, {});
      expect(score).toBeGreaterThan(0);
    });
  });

  describe('calculateReputationScore', () => {
    test('should normalize reputation score', () => {
      expect(calculateReputationScore(10)).toBe(1);
      expect(calculateReputationScore(5)).toBe(0.5);
      expect(calculateReputationScore(0)).toBe(0);
    });

    test('should handle null reputation score', () => {
      expect(calculateReputationScore(null)).toBe(0);
    });
  });

  describe('generateMatchExplanation', () => {
    test('should generate explanation with matched skills', () => {
      const matchData = {
        skillScore: 0.8,
        experienceScore: 0.9,
        salaryScore: 0.7,
        reputationScore: 0.6,
        matchedSkills: ['react', 'javascript', 'node.js']
      };
      
      const explanation = generateMatchExplanation(matchData);
      expect(explanation).toContain('3 skills matched');
      expect(explanation).toContain('react');
    });

    test('should generate explanation for strong experience', () => {
      const matchData = {
        skillScore: 0.5,
        experienceScore: 0.9,
        salaryScore: 0.3,
        reputationScore: 0.4,
        matchedSkills: ['python']
      };
      
      const explanation = generateMatchExplanation(matchData);
      expect(explanation).toContain('Strong experience match');
    });

    test('should handle empty matched skills', () => {
      const matchData = {
        skillScore: 0.2,
        experienceScore: 0.3,
        salaryScore: 0.4,
        reputationScore: 0.5,
        matchedSkills: []
      };
      
      const explanation = generateMatchExplanation(matchData);
      expect(explanation).toBe('');
    });
  });
});



