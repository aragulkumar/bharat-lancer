// AI Skill Passport Service
// Extracts and scores skills from user data

// Common tech skills database for extraction
const TECH_SKILLS = [
  // Programming Languages
  'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
  'kotlin', 'typescript', 'r', 'matlab', 'scala', 'perl', 'dart',
  
  // Web Technologies
  'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
  'spring', 'asp.net', 'laravel', 'rails', 'next.js', 'nuxt', 'svelte',
  
  // Mobile Development
  'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
  
  // Databases
  'mongodb', 'mysql', 'postgresql', 'oracle', 'sql server', 'redis', 'cassandra',
  'dynamodb', 'firebase', 'sqlite', 'mariadb',
  
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'ci/cd',
  'terraform', 'ansible', 'linux', 'nginx', 'apache',
  
  // AI/ML
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
  'nlp', 'computer vision', 'data science', 'pandas', 'numpy',
  
  // Other
  'rest api', 'graphql', 'microservices', 'agile', 'scrum', 'ui/ux', 'figma',
  'photoshop', 'illustrator', 'seo', 'digital marketing', 'content writing'
];

/**
 * Extract skills from text (resume, portfolio, etc.)
 * @param {String} text - Text to extract skills from
 * @returns {Array} - Array of extracted skills
 */
exports.extractSkills = (text) => {
  if (!text) return [];
  
  const lowerText = text.toLowerCase();
  const extractedSkills = [];
  
  TECH_SKILLS.forEach(skill => {
    // Check if skill exists in text
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      // Count frequency
      const matches = lowerText.match(new RegExp(skill, 'gi'));
      extractedSkills.push({
        skill: skill,
        frequency: matches ? matches.length : 1
      });
    }
  });
  
  // Sort by frequency and return unique skills
  return extractedSkills
    .sort((a, b) => b.frequency - a.frequency)
    .map(item => item.skill);
};

/**
 * Calculate AI Skill Score for a user
 * Formula: (Projects × 0.4) + (Portfolio Quality × 0.3) + (Resume Match × 0.3)
 * @param {Object} user - User object
 * @returns {Number} - Skill score (0-100)
 */
exports.calculateSkillScore = (user) => {
  let score = 0;
  
  // 1. Project Score (40 points max)
  // More projects = higher score, capped at 40
  const projectScore = Math.min((user.projectCount || 0) * 10, 40);
  score += projectScore;
  
  // 2. Portfolio Quality (30 points max)
  // Number of portfolio links and their quality
  const portfolioCount = user.portfolioLinks ? user.portfolioLinks.length : 0;
  const portfolioScore = Math.min(portfolioCount * 10, 30);
  score += portfolioScore;
  
  // 3. Resume Match (30 points max)
  // Presence of resume and skill extraction
  let resumeScore = 0;
  if (user.resumeText) {
    const extractedSkills = exports.extractSkills(user.resumeText);
    // Base 15 points for having resume
    resumeScore = 15;
    // Additional points based on skills found (max 15 more)
    resumeScore += Math.min(extractedSkills.length * 1.5, 15);
  }
  score += resumeScore;
  
  return Math.min(Math.round(score), 100);
};

/**
 * Verify and score individual skills for a user
 * @param {Object} user - User object
 * @returns {Array} - Array of verified skills with scores
 */
exports.verifySkills = (user) => {
  const verifiedSkills = [];
  
  // Extract skills from resume
  const resumeSkills = user.resumeText ? exports.extractSkills(user.resumeText) : [];
  
  // Combine with user-declared skills
  const declaredSkills = user.skills || [];
  
  // Create a set of all skills
  const allSkills = new Set([...resumeSkills, ...declaredSkills.map(s => s.toLowerCase())]);
  
  allSkills.forEach(skill => {
    let skillScore = 0;
    
    // Check if in resume (50 points)
    if (resumeSkills.includes(skill)) {
      skillScore += 50;
    }
    
    // Check if in declared skills (30 points)
    if (declaredSkills.map(s => s.toLowerCase()).includes(skill)) {
      skillScore += 30;
    }
    
    // Check if in portfolio links (20 points)
    if (user.portfolioLinks && user.portfolioLinks.length > 0) {
      const portfolioText = user.portfolioLinks.join(' ').toLowerCase();
      if (portfolioText.includes(skill)) {
        skillScore += 20;
      }
    }
    
    verifiedSkills.push({
      skill: skill,
      score: Math.min(skillScore, 100),
      verifiedAt: new Date()
    });
  });
  
  // Sort by score
  return verifiedSkills.sort((a, b) => b.score - a.score);
};

/**
 * Generate skill passport summary
 * @param {Object} user - User object
 * @returns {Object} - Skill passport summary
 */
exports.generateSkillPassport = (user) => {
  const aiSkillScore = exports.calculateSkillScore(user);
  const verifiedSkills = exports.verifySkills(user);
  
  return {
    userId: user._id,
    name: user.name,
    overallScore: aiSkillScore,
    verifiedSkills: verifiedSkills.slice(0, 10), // Top 10 skills
    breakdown: {
      projectScore: Math.min((user.projectCount || 0) * 10, 40),
      portfolioScore: Math.min((user.portfolioLinks?.length || 0) * 10, 30),
      resumeScore: user.resumeText ? 30 : 0
    },
    totalSkills: verifiedSkills.length,
    topSkills: verifiedSkills.slice(0, 5).map(s => s.skill),
    generatedAt: new Date()
  };
};

/**
 * Update user's skill passport
 * @param {Object} user - Mongoose user document
 * @returns {Object} - Updated user
 */
exports.updateUserSkillPassport = async (user) => {
  // Calculate new skill score
  user.aiSkillScore = exports.calculateSkillScore(user);
  
  // Verify skills
  user.verifiedSkills = exports.verifySkills(user);
  
  // Update skills array if resume provided
  if (user.resumeText) {
    const extractedSkills = exports.extractSkills(user.resumeText);
    // Merge with existing skills
    const allSkills = new Set([...user.skills, ...extractedSkills]);
    user.skills = Array.from(allSkills);
  }
  
  await user.save();
  return user;
};
