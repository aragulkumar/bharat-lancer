// Voice Job Input Service
// Parses voice transcripts into structured job data

/**
 * Parse job details from voice transcript
 * Extracts skills, budget, duration, location, etc.
 * @param {String} transcript - Voice transcript text
 * @returns {Object} - Parsed job data
 */
exports.parseJobFromText = (transcript) => {
  if (!transcript) {
    throw new Error('Transcript is required');
  }

  const lowerText = transcript.toLowerCase();
  const jobData = {
    title: '',
    description: transcript,
    requiredSkills: [],
    budget: { min: 0, max: 0, currency: 'INR' },
    locationPreference: '',
    duration: '',
    jobType: 'freelance',
    createdViaVoice: true,
    voiceTranscript: transcript
  };

  // 1. Extract Skills
  const skillKeywords = [
    'python', 'javascript', 'java', 'react', 'node', 'angular', 'vue',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript',
    'html', 'css', 'django', 'flask', 'spring', 'laravel',
    'android', 'ios', 'flutter', 'react native',
    'mongodb', 'mysql', 'postgresql', 'sql',
    'aws', 'azure', 'docker', 'kubernetes',
    'machine learning', 'ai', 'data science', 'ui/ux', 'design',
    'content writing', 'seo', 'digital marketing'
  ];

  skillKeywords.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(lowerText)) {
      jobData.requiredSkills.push(skill);
    }
  });

  // 2. Extract Job Title (common patterns)
  const titlePatterns = [
    /need (?:a |an )?([a-z\s]+) developer/i,
    /looking for (?:a |an )?([a-z\s]+) developer/i,
    /want (?:a |an )?([a-z\s]+) developer/i,
    /hire (?:a |an )?([a-z\s]+) developer/i,
    /need (?:a |an )?([a-z\s]+) designer/i,
    /looking for (?:a |an )?([a-z\s]+) designer/i
  ];

  for (const pattern of titlePatterns) {
    const match = transcript.match(pattern);
    if (match) {
      jobData.title = `${match[1].trim()} Developer`;
      break;
    }
  }

  // Fallback title based on skills
  if (!jobData.title && jobData.requiredSkills.length > 0) {
    jobData.title = `${jobData.requiredSkills[0]} Developer`;
  } else if (!jobData.title) {
    jobData.title = 'Freelance Project';
  }

  // 3. Extract Location
  const indianCities = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai',
    'kolkata', 'pune', 'ahmedabad', 'jaipur', 'surat', 'lucknow',
    'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam',
    'pimpri', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra',
    'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar',
    'aurangabad', 'dhanbad', 'amritsar', 'navi mumbai', 'allahabad',
    'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada',
    'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati'
  ];

  for (const city of indianCities) {
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(lowerText)) {
      jobData.locationPreference = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Check for "remote" keyword
  if (/\bremote\b/i.test(lowerText)) {
    jobData.locationPreference = 'Remote';
  }

  // 4. Extract Budget
  // Patterns: "5000 rupees", "₹5000", "5k", "budget of 10000"
  const budgetPatterns = [
    /₹\s*(\d+(?:,\d+)*)/,
    /(\d+(?:,\d+)*)\s*rupees?/i,
    /budget\s+(?:of\s+)?₹?\s*(\d+(?:,\d+)*)/i,
    /(\d+)k\s*rupees?/i,
    /₹?\s*(\d+)k/i
  ];

  for (const pattern of budgetPatterns) {
    const match = transcript.match(pattern);
    if (match) {
      let amount = match[1].replace(/,/g, '');
      
      // Handle "k" notation
      if (pattern.toString().includes('k')) {
        amount = parseInt(amount) * 1000;
      } else {
        amount = parseInt(amount);
      }

      jobData.budget.min = Math.floor(amount * 0.8); // 80% of stated
      jobData.budget.max = Math.ceil(amount * 1.2);  // 120% of stated
      break;
    }
  }

  // Default budget if not found
  if (jobData.budget.max === 0) {
    jobData.budget.min = 10000;
    jobData.budget.max = 50000;
  }

  // 5. Extract Duration
  const durationPatterns = [
    /(\d+)\s*(?:weeks?|wks?)/i,
    /(\d+)\s*(?:months?|mos?)/i,
    /(\d+)\s*(?:days?)/i,
    /for\s+(\d+)\s+(?:weeks?|months?|days?)/i
  ];

  for (const pattern of durationPatterns) {
    const match = transcript.match(pattern);
    if (match) {
      jobData.duration = match[0];
      break;
    }
  }

  // Default duration
  if (!jobData.duration) {
    jobData.duration = '2-4 weeks';
  }

  // 6. Extract Job Type
  if (/\bfull.?time\b/i.test(lowerText)) {
    jobData.jobType = 'full-time';
  } else if (/\bpart.?time\b/i.test(lowerText)) {
    jobData.jobType = 'part-time';
  } else if (/\bcontract\b/i.test(lowerText)) {
    jobData.jobType = 'contract';
  }

  return jobData;
};

/**
 * Validate parsed job data
 * @param {Object} jobData - Parsed job data
 * @returns {Object} - Validation result
 */
exports.validateParsedJob = (jobData) => {
  const errors = [];
  const warnings = [];

  if (!jobData.title) {
    errors.push('Could not extract job title');
  }

  if (!jobData.requiredSkills || jobData.requiredSkills.length === 0) {
    warnings.push('No skills detected. Please add required skills manually.');
  }

  if (!jobData.budget || jobData.budget.max === 0) {
    warnings.push('No budget detected. Default budget applied.');
  }

  if (!jobData.locationPreference) {
    warnings.push('No location detected. Consider specifying location preference.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Generate suggestions for improving voice input
 * @param {String} transcript - Voice transcript
 * @returns {Array} - Array of suggestions
 */
exports.generateSuggestions = (transcript) => {
  const suggestions = [];
  const lowerText = transcript.toLowerCase();

  if (!lowerText.includes('budget') && !lowerText.match(/₹|\d+\s*rupees?/)) {
    suggestions.push('Mention your budget (e.g., "budget is 20000 rupees")');
  }

  if (!lowerText.match(/\d+\s*(?:weeks?|months?|days?)/)) {
    suggestions.push('Specify project duration (e.g., "for 2 weeks")');
  }

  const hasLocation = lowerText.match(/mumbai|delhi|bangalore|chennai|remote/i);
  if (!hasLocation) {
    suggestions.push('Mention location preference (e.g., "from Chennai" or "remote")');
  }

  return suggestions;
};
