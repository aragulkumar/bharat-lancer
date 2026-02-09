// Use node-fetch for API calls (Node.js doesn't have native fetch)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

/**
 * AI Service for voice-to-text processing
 */

// Common tech skills database for extraction
const TECH_SKILLS = [
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL',
    'Python', 'Django', 'Flask', 'Java', 'Spring', 'PHP', 'Laravel',
    'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Bootstrap',
    'Flutter', 'React Native', 'Swift', 'Kotlin', 'Android', 'iOS',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'CI/CD',
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'AI',
    'Figma', 'Adobe XD', 'Photoshop', 'UI Design', 'UX Design',
    'SEO', 'Digital Marketing', 'Content Writing', 'Copywriting',
    'Video Editing', 'After Effects', 'Premiere Pro'
];

/**
 * Translate Tamil voice text to English using better API
 * Only for voice input, not general text translation
 */
exports.translateVoiceText = async (text, from = 'ta') => {
    try {
        console.log('🔄 Translating Tamil voice:', text.substring(0, 100));
        
        // Use MyMemory API (more reliable, free)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|en`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData.translatedText) {
            console.log('✅ Translation successful:', data.responseData.translatedText.substring(0, 100));
            return data.responseData.translatedText;
        }
        
        throw new Error('Translation API returned error');
    } catch (error) {
        console.error('❌ Voice translation error:', error.message);
        
        // Fallback: Try Google Translate Free API
        try {
            const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const googleResponse = await fetch(googleUrl);
            const googleData = await googleResponse.json();
            
            if (googleData && googleData[0] && googleData[0][0] && googleData[0][0][0]) {
                const translated = googleData[0].map(item => item[0]).join(' ');
                console.log('✅ Google Translate fallback successful:', translated.substring(0, 100));
                return translated;
            }
        } catch (fallbackError) {
            console.error('❌ Fallback translation failed:', fallbackError.message);
        }
        
        // Last resort: return original text
        console.warn('⚠️ Using original text as translation failed');
        return text;
    }
};

/**
 * Extract skills from text
 */
exports.extractSkills = (text) => {
    const foundSkills = [];
    const lowerText = text.toLowerCase();
    
    TECH_SKILLS.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            foundSkills.push(skill);
        }
    });
    
    return [...new Set(foundSkills)]; // Remove duplicates
};

/**
 * Extract budget from text
 */
exports.extractBudget = (text) => {
    // Match patterns like: 50000, 50,000, 50k, 50 thousand
    const patterns = [
        /(\d+)\s*(?:thousand|k)/i,
        /(?:₹|rs\.?|rupees?)\s*(\d+(?:,\d+)*)/i,
        /(\d+(?:,\d+)*)\s*(?:₹|rs\.?|rupees?)/i,
        /(\d{4,})/  // Any 4+ digit number
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            let amount = match[1].replace(/,/g, '');
            if (text.toLowerCase().includes('thousand') || text.toLowerCase().includes('k')) {
                amount = parseInt(amount) * 1000;
            }
            return { min: parseInt(amount) * 0.8, max: parseInt(amount) * 1.2 };
        }
    }
    
    return null;
};

/**
 * Extract duration from text
 */
exports.extractDuration = (text) => {
    const patterns = [
        { regex: /(\d+)\s*(?:week|weeks)/i, unit: 'week' },
        { regex: /(\d+)\s*(?:month|months)/i, unit: 'month' },
        { regex: /(\d+)\s*(?:day|days)/i, unit: 'day' }
    ];
    
    for (const { regex, unit } of patterns) {
        const match = text.match(regex);
        if (match) {
            const count = parseInt(match[1]);
            return `${count} ${unit}${count > 1 ? 's' : ''}`;
        }
    }
    
    return null;
};

/**
 * Extract job title from text
 */
exports.extractJobTitle = (text, skills) => {
    // Common job title patterns
    const patterns = [
        /(?:need|want|looking for|require)\s+(?:a|an)?\s*([^.]+?)(?:developer|designer|writer|marketer|editor)/i,
        /([^.]+?)(?:developer|designer|writer|marketer|editor)/i
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            let title = match[0].replace(/^(need|want|looking for|require)\s+(?:a|an)?\s*/i, '');
            title = title.charAt(0).toUpperCase() + title.slice(1);
            return title;
        }
    }
    
    // Fallback: use first skill + "Developer/Designer"
    if (skills.length > 0) {
        const skill = skills[0];
        if (skill.toLowerCase().includes('design') || skill.toLowerCase().includes('figma')) {
            return `${skill} Designer`;
        }
        return `${skill} Developer`;
    }
    
    return 'Project Development';
};

/**
 * Process voice transcript and extract job details
 */
exports.processVoiceToJob = async (transcript, language = 'ta') => {
    try {
        // Step 1: Translate Tamil voice to English if needed
        let englishText = transcript;
        if (language === 'ta' || language === 'ta-IN') {
            englishText = await exports.translateVoiceText(transcript, 'ta');
            console.log('Tamil voice translated:', { original: transcript, translated: englishText });
        }
        
        // Step 2: Extract details
        const skills = exports.extractSkills(englishText);
        const budget = exports.extractBudget(englishText);
        const duration = exports.extractDuration(englishText);
        const title = exports.extractJobTitle(englishText, skills);
        
        return {
            title,
            description: englishText,
            requiredSkills: skills,
            budget: budget || { min: 10000, max: 50000 },
            duration: duration || '1 month',
            originalText: transcript,
            translatedText: englishText,
            language
        };
    } catch (error) {
        console.error('Voice processing error:', error);
        throw error;
    }
};

/**
 * Find top matching freelancers based on skills and budget
 */
exports.findMatchingFreelancers = async (skills, budget) => {
    try {
        const User = require('../models/User');
        
        // Get all freelancers
        const freelancers = await User.find({ role: 'freelancer' })
            .select('name email skills hourlyRate portfolio bio location');
        
        // Calculate match score for each freelancer
        const scoredFreelancers = freelancers.map(freelancer => {
            let score = 0;
            
            // Skill matching (70% weight)
            const matchedSkills = freelancer.skills.filter(skill =>
                skills.some(reqSkill => 
                    skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
                    reqSkill.toLowerCase().includes(skill.toLowerCase())
                )
            );
            const skillScore = (matchedSkills.length / Math.max(skills.length, 1)) * 70;
            score += skillScore;
            
            // Budget compatibility (30% weight)
            if (freelancer.hourlyRate && budget) {
                const estimatedCost = freelancer.hourlyRate * 160; // ~1 month
                const budgetMid = (budget.min + budget.max) / 2;
                const budgetDiff = Math.abs(estimatedCost - budgetMid) / budgetMid;
                const budgetScore = Math.max(0, (1 - budgetDiff) * 30);
                score += budgetScore;
            }
            
            return {
                _id: freelancer._id,
                name: freelancer.name,
                email: freelancer.email,
                skills: freelancer.skills,
                hourlyRate: freelancer.hourlyRate,
                portfolio: freelancer.portfolio,
                bio: freelancer.bio,
                location: freelancer.location,
                matchedSkills,
                matchScore: Math.round(score)
            };
        });
        
        // Sort by score and return top 5
        return scoredFreelancers
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 5);
    } catch (error) {
        console.error('Freelancer matching error:', error);
        return [];
    }
};
