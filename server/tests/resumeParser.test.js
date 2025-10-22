const { extractSkills, normalizeText } = require('../services/resumeParser.service');

describe('Resume Parser Service', () => {
  describe('normalizeText', () => {
    test('should normalize text correctly', () => {
      const input = 'Hello, World!   This   is   a   test.';
      const expected = 'hello world this is a test';
      expect(normalizeText(input)).toBe(expected);
    });

    test('should handle empty string', () => {
      expect(normalizeText('')).toBe('');
    });

    test('should remove special characters', () => {
      const input = 'React.js, Node.js, & MongoDB!';
      const expected = 'react js node js mongodb';
      expect(normalizeText(input)).toBe(expected);
    });
  });

  describe('extractSkills', () => {
    test('should extract skills from text', () => {
      const text = 'I have experience with React, JavaScript, and Node.js development.';
      const skills = extractSkills(text);
      
      expect(skills).toContain('react');
      expect(skills).toContain('javascript');
      expect(skills).toContain('node.js');
    });

    test('should return empty array for text with no skills', () => {
      const text = 'This is just a regular sentence with no technical skills.';
      const skills = extractSkills(text);
      
      expect(skills).toEqual([]);
    });

    test('should handle case insensitive matching', () => {
      const text = 'I know REACT, JAVASCRIPT, and node.js';
      const skills = extractSkills(text);
      
      expect(skills).toContain('react');
      expect(skills).toContain('javascript');
      expect(skills).toContain('node.js');
    });

    test('should limit skills to 50', () => {
      const text = 'react javascript python java c++ c# php ruby go rust swift angular vue node.js express django flask spring laravel html css sass less bootstrap tailwind material-ui mongodb mysql postgresql redis elasticsearch firebase aws azure gcp docker kubernetes jenkins git github machine learning artificial intelligence data science analytics photoshop illustrator figma sketch adobe xd project management agile scrum kanban jira trello communication leadership teamwork problem solving analytical thinking';
      const skills = extractSkills(text);
      
      expect(skills.length).toBeLessThanOrEqual(50);
    });
  });
});



