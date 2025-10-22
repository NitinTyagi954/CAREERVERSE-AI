const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const skillsData = require('../utils/skills.json');
const { AppError } = require('../middleware/error.middleware');

/**
 * Extract text from PDF file
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new AppError('Failed to parse PDF file', 500);
  }
};

/**
 * Extract text from DOCX file
 */
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new AppError('Failed to parse DOCX file', 500);
  }
};

/**
 * Extract text from file based on its type
 */
const extractTextFromFile = async (filePath, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      return await extractTextFromPDF(filePath);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      return await extractTextFromDOCX(filePath);
    } else {
      throw new AppError('Unsupported file type for text extraction', 400);
    }
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    throw new AppError('Failed to extract text from file', 500);
  }
};

/**
 * Normalize text for processing
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s]/g, ' ') // Remove special characters except spaces
    .trim();
};

/**
 * Extract skills from resume text
 */
const extractSkills = (text) => {
  try {
    const normalizedText = normalizeText(text);
    const words = normalizedText.split(/\s+/);
    const foundSkills = new Set();

    // Check for exact matches
    skillsData.forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      // Check if skill appears in text (exact match)
      if (normalizedText.includes(skillLower)) {
        foundSkills.add(skillLower);
      }
      
      // Check individual words for partial matches
      words.forEach(word => {
        if (word.length > 2 && skillLower.includes(word)) {
          foundSkills.add(skillLower);
        }
      });
    });

    // Additional skill extraction using common patterns
    const skillPatterns = [
      /(?:proficient|skilled|experienced|expert|knowledge|familiar)\s+(?:in|with|at)\s+([a-zA-Z\s]+)/gi,
      /(?:programming|development|framework|technology|tool|software|language|platform)s?\s*:?\s*([a-zA-Z\s,]+)/gi,
      /(?:skills|technologies|tools|languages|frameworks|platforms)\s*:?\s*([a-zA-Z\s,]+)/gi
    ];

    skillPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const skills = match[1].split(/[,\n]/).map(s => s.trim().toLowerCase());
        skills.forEach(skill => {
          if (skill.length > 2 && skill.length < 50) {
            foundSkills.add(skill);
          }
        });
      }
    });

    return Array.from(foundSkills).slice(0, 50); // Limit to 50 skills
  } catch (error) {
    console.error('Skill extraction error:', error);
    return [];
  }
};

/**
 * Extract education information
 */
const extractEducation = (text) => {
  try {
    const education = [];
    
    // Common degree patterns
    const degreePatterns = [
      /(bachelor|b\.?s\.?|b\.?e\.?|b\.?tech|b\.?com|b\.?a\.?|b\.?sc\.?)\s+(?:of|in)?\s*([a-zA-Z\s]+)/gi,
      /(master|m\.?s\.?|m\.?e\.?|m\.?tech|m\.?com|m\.?a\.?|m\.?sc\.?)\s+(?:of|in)?\s*([a-zA-Z\s]+)/gi,
      /(phd|ph\.?d\.?|doctorate)\s+(?:in|of)?\s*([a-zA-Z\s]+)/gi,
      /(diploma|certificate)\s+(?:in|of)?\s*([a-zA-Z\s]+)/gi
    ];

    // Institution patterns
    const institutionPatterns = [
      /(?:university|college|institute|school|academy)\s+of\s+([a-zA-Z\s]+)/gi,
      /([a-zA-Z\s]+)\s+(?:university|college|institute|school|academy)/gi
    ];

    // Year patterns
    const yearPattern = /(19|20)\d{2}/g;

    degreePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const degree = match[0].trim();
        const field = match[2] ? match[2].trim() : '';
        
        // Find associated institution
        let institution = 'Not specified';
        institutionPatterns.forEach(instPattern => {
          const instMatch = instPattern.exec(text);
          if (instMatch) {
            institution = instMatch[0].trim();
          }
        });

        // Find associated year
        const yearMatch = yearPattern.exec(text);
        const year = yearMatch ? parseInt(yearMatch[0]) : null;

        education.push({
          degree: degree,
          institution: institution,
          year: year
        });
      }
    });

    return education.slice(0, 10); // Limit to 10 education entries
  } catch (error) {
    console.error('Education extraction error:', error);
    return [];
  }
};

/**
 * Extract work experience
 */
const extractExperience = (text) => {
  try {
    const experience = [];
    
    // Date patterns
    const datePatterns = [
      /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/gi,
      /\d{1,2}\/\d{4}/g,
      /\d{4}\s*[-–]\s*\d{4}/g,
      /(present|current|ongoing)/gi
    ];

    // Job title patterns
    const titlePatterns = [
      /(?:software|web|mobile|frontend|backend|full.?stack|devops|data|ai|ml)\s+(?:engineer|developer|architect|specialist|analyst)/gi,
      /(?:senior|junior|lead|principal)\s+(?:software|web|mobile|frontend|backend|full.?stack|devops|data|ai|ml)\s+(?:engineer|developer|architect|specialist|analyst)/gi,
      /(?:project|product|program|technical)\s+(?:manager|lead|coordinator|director)/gi,
      /(?:intern|internship|trainee|associate|consultant)/gi
    ];

    // Company patterns
    const companyPatterns = [
      /(?:at|@|in)\s+([A-Z][a-zA-Z\s&.,]+(?:inc|corp|ltd|llc|pvt|limited|company|technologies|solutions|systems)?)/gi
    ];

    // Extract experiences using patterns
    const lines = text.split('\n');
    
    lines.forEach((line, index) => {
      // Check for job titles
      titlePatterns.forEach(pattern => {
        const titleMatch = pattern.exec(line);
        if (titleMatch) {
          const title = titleMatch[0].trim();
          
          // Find company in nearby lines
          let company = 'Not specified';
          for (let i = Math.max(0, index - 2); i <= Math.min(lines.length - 1, index + 2); i++) {
            companyPatterns.forEach(compPattern => {
              const compMatch = compPattern.exec(lines[i]);
              if (compMatch) {
                company = compMatch[1].trim();
              }
            });
          }

          // Find dates in nearby lines
          let startDate = null;
          let endDate = null;
          for (let i = Math.max(0, index - 3); i <= Math.min(lines.length - 1, index + 3); i++) {
            datePatterns.forEach(datePattern => {
              const dateMatch = datePattern.exec(lines[i]);
              if (dateMatch) {
                if (!startDate) {
                  startDate = new Date(dateMatch[0]);
                } else if (!endDate) {
                  endDate = new Date(dateMatch[0]);
                }
              }
            });
          }

          experience.push({
            title: title,
            company: company,
            start: startDate,
            end: endDate,
            bullets: [],
            description: line.trim()
          });
        }
      });
    });

    return experience.slice(0, 20); // Limit to 20 experience entries
  } catch (error) {
    console.error('Experience extraction error:', error);
    return [];
  }
};

/**
 * Parse resume file and extract structured data
 */
const parseResumeFile = async (filePath, mimeType) => {
  try {
    // Extract text from file
    const text = await extractTextFromFile(filePath, mimeType);
    
    if (!text || text.trim().length === 0) {
      throw new AppError('No text content found in file', 400);
    }

    // Extract structured data
    const skills = extractSkills(text);
    const education = extractEducation(text);
    const experience = extractExperience(text);

    return {
      text: text,
      skills: skills,
      education: education,
      experience: experience,
      isParsed: true,
      parseError: null
    };
  } catch (error) {
    if (error.isOperational) {
      throw error;
    }
    
    // Return partial data if parsing fails
    return {
      text: '',
      skills: [],
      education: [],
      experience: [],
      isParsed: false,
      parseError: error.message
    };
  }
};

module.exports = {
  extractTextFromFile,
  extractSkills,
  extractEducation,
  extractExperience,
  parseResumeFile,
  normalizeText
};



