// AI Matching Service
// Matches freelancers to jobs using rule-based and AI algorithms

const User = require('../models/User');

/**
 * Rule-based matching algorithm
 * Matches based on skills, budget, and location
 * @param {Object} job - Job object
 * @param {Array} freelancers - Array of freelancer users
 * @returns {Array} - Sorted array of matches with scores
 */
exports.ruleBasedMatch = (job, freelancers) => {
  const matches = [];

  freelancers.forEach(freelancer => {
    let score = 0;
    const reasons = [];

    // 1. Skill Overlap (40 points)
    const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
    const freelancerSkills = freelancer.skills.map(s => s.toLowerCase());
    
    const matchedSkills = jobSkills.filter(skill => 
      freelancerSkills.includes(skill)
    );
    
    const skillOverlapPercent = jobSkills.length > 0 
      ? (matchedSkills.length / jobSkills.length) * 100 
      : 0;
    
    const skillScore = (skillOverlapPercent / 100) * 40;
    score += skillScore;
    
    if (matchedSkills.length > 0) {
      reasons.push(`${matchedSkills.length}/${jobSkills.length} skills match: ${matchedSkills.slice(0, 3).join(', ')}`);
    }

    // 2. Budget Fit (30 points)
    if (freelancer.hourlyRate && job.budget) {
      const avgBudget = (job.budget.min + job.budget.max) / 2;
      const budgetDiff = Math.abs(avgBudget - freelancer.hourlyRate);
      const budgetDiffPercent = (budgetDiff / avgBudget) * 100;
      
      // Less difference = higher score
      const budgetScore = Math.max(0, 30 - (budgetDiffPercent / 100) * 30);
      score += budgetScore;
      
      if (freelancer.hourlyRate >= job.budget.min && freelancer.hourlyRate <= job.budget.max) {
        reasons.push(`Rate ₹${freelancer.hourlyRate}/hr fits budget`);
      } else if (budgetScore > 15) {
        reasons.push(`Rate ₹${freelancer.hourlyRate}/hr close to budget`);
      }
    }

    // 3. Location Match (15 points)
    if (job.locationPreference && freelancer.location) {
      const jobLocation = job.locationPreference.toLowerCase();
      const freelancerLocation = freelancer.location.toLowerCase();
      
      if (jobLocation === freelancerLocation) {
        score += 15;
        reasons.push(`Located in ${freelancer.location}`);
      } else if (freelancerLocation.includes(jobLocation) || jobLocation.includes(freelancerLocation)) {
        score += 10;
        reasons.push(`Near ${job.locationPreference}`);
      }
    }

    // 4. AI Skill Score (15 points)
    const aiScore = (freelancer.aiSkillScore / 100) * 15;
    score += aiScore;
    
    if (freelancer.aiSkillScore > 70) {
      reasons.push(`High skill score (${freelancer.aiSkillScore}/100)`);
    }

    // Only include if minimum score threshold met
    if (score >= 20) {
      matches.push({
        freelancer: {
          id: freelancer._id,
          name: freelancer.name,
          email: freelancer.email,
          location: freelancer.location,
          skills: freelancer.skills,
          hourlyRate: freelancer.hourlyRate,
          aiSkillScore: freelancer.aiSkillScore,
          rating: freelancer.rating,
          reviewCount: freelancer.reviewCount
        },
        matchScore: Math.round(score),
        reasons: reasons,
        matchedSkills: matchedSkills
      });
    }
  });

  // Sort by score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Simple embedding-based matching (demo level)
 * Uses text similarity for matching
 * @param {Object} job - Job object
 * @param {Array} freelancers - Array of freelancer users
 * @returns {Array} - Sorted array of matches
 */
exports.embeddingMatch = (job, freelancers) => {
  const matches = [];

  // Create job text representation
  const jobText = `${job.title} ${job.description} ${job.requiredSkills.join(' ')}`.toLowerCase();

  freelancers.forEach(freelancer => {
    // Create freelancer text representation
    const freelancerText = `${freelancer.skills.join(' ')} ${freelancer.resumeText || ''}`.toLowerCase();

    // Simple word overlap similarity (demo level)
    const jobWords = new Set(jobText.split(/\s+/).filter(w => w.length > 3));
    const freelancerWords = new Set(freelancerText.split(/\s+/).filter(w => w.length > 3));

    // Calculate Jaccard similarity
    const intersection = new Set([...jobWords].filter(x => freelancerWords.has(x)));
    const union = new Set([...jobWords, ...freelancerWords]);
    
    const similarity = union.size > 0 ? (intersection.size / union.size) * 100 : 0;

    if (similarity > 10) {
      matches.push({
        freelancer: {
          id: freelancer._id,
          name: freelancer.name,
          skills: freelancer.skills
        },
        similarityScore: Math.round(similarity),
        commonTerms: Array.from(intersection).slice(0, 5)
      });
    }
  });

  return matches.sort((a, b) => b.similarityScore - a.similarityScore);
};

/**
 * Generate human-readable match explanation
 * @param {Object} match - Match object from ruleBasedMatch
 * @returns {String} - Explanation text
 */
exports.generateMatchExplanation = (match) => {
  const { freelancer, matchScore, reasons, matchedSkills } = match;
  
  let explanation = `${freelancer.name} is a ${matchScore}% match for this job. `;
  
  if (reasons.length > 0) {
    explanation += `Key factors: ${reasons.join('; ')}.`;
  }
  
  if (matchedSkills && matchedSkills.length > 0) {
    explanation += ` Matching skills: ${matchedSkills.join(', ')}.`;
  }

  return explanation;
};

/**
 * Find best matches for a job
 * Combines rule-based and embedding matching
 * @param {Object} job - Job object
 * @param {Number} limit - Maximum number of matches to return
 * @returns {Array} - Top matches
 */
exports.findBestMatches = async (job, limit = 10) => {
  try {
    // Get all active freelancers
    const freelancers = await User.find({ 
      role: 'freelancer',
      skills: { $exists: true, $ne: [] }
    });

    if (freelancers.length === 0) {
      return [];
    }

    // Get rule-based matches
    const matches = exports.ruleBasedMatch(job, freelancers);

    // Add explanations
    const matchesWithExplanations = matches.map(match => ({
      ...match,
      explanation: exports.generateMatchExplanation(match)
    }));

    // Return top matches
    return matchesWithExplanations.slice(0, limit);
  } catch (error) {
    console.error('Find best matches error:', error);
    throw error;
  }
};
