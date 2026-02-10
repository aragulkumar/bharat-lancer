const SkillPassport = require('../models/SkillPassport');
const Portfolio = require('../models/Portfolio');
const Resume = require('../models/Resume');

/**
 * Calculate skill score based on projects, resume, and portfolio
 * Formula: (Projects × 0.4) + (Resume × 0.3) + (Portfolio × 0.3)
 */
const calculateSkillScore = async (userId, skillName) => {
    try {
        const portfolio = await Portfolio.findOne({ user: userId });
        const resume = await Resume.findOne({ user: userId });

        let projectScore = 0;
        let resumeScore = 0;
        let portfolioScore = 0;

        // 1. PROJECT SCORE (40 points max)
        if (portfolio && portfolio.projects.length > 0) {
            const relevantProjects = portfolio.projects.filter(p =>
                p.technologies.some(tech =>
                    tech.toLowerCase().includes(skillName.toLowerCase())
                )
            );

            // Number of projects (10 points)
            const projectCount = relevantProjects.length;
            let projectCountScore = 0;
            if (projectCount >= 6) projectCountScore = 10;
            else if (projectCount >= 3) projectCountScore = 7;
            else if (projectCount > 0) projectCountScore = 4;

            // Project complexity (15 points) - average complexity
            const avgComplexity = relevantProjects.length > 0
                ? relevantProjects.reduce((sum, p) => sum + (p.complexity || 50), 0) / relevantProjects.length
                : 0;
            const complexityScore = (avgComplexity / 100) * 15;

            // Technology diversity (5 points)
            const uniqueTechs = new Set(portfolio.projects.flatMap(p => p.technologies));
            const diversityScore = Math.min(uniqueTechs.size / 10, 1) * 5;

            // Client ratings (10 points) - placeholder, can be enhanced
            const ratingScore = 8; // Default good rating

            projectScore = projectCountScore + complexityScore + diversityScore + ratingScore;
        }

        // 2. RESUME SCORE (30 points max)
        if (resume) {
            // Years of experience (10 points)
            const years = resume.stats.yearsExperience || 0;
            let experienceScore = 0;
            if (years >= 6) experienceScore = 10;
            else if (years >= 4) experienceScore = 8;
            else if (years >= 2) experienceScore = 6;
            else if (years >= 1) experienceScore = 3;

            // Education (8 points)
            const educationScore = resume.education.length > 0 ? 8 : 0;

            // Certifications (7 points)
            const certScore = Math.min(resume.certifications.length * 2, 7);

            // Relevant keywords (5 points)
            const hasSkill = resume.skills.some(s =>
                s.toLowerCase().includes(skillName.toLowerCase())
            );
            const keywordScore = hasSkill ? 5 : 0;

            resumeScore = experienceScore + educationScore + certScore + keywordScore;
        }

        // 3. PORTFOLIO SCORE (30 points max)
        if (portfolio) {
            // Portfolio quality (15 points) - based on featured projects and links
            const featuredCount = portfolio.projects.filter(p => p.featured).length;
            const qualityScore = Math.min(featuredCount * 3, 10);
            const hasLinks = Object.values(portfolio.links).filter(l => l).length;
            const linkScore = Math.min(hasLinks, 5);

            // Live projects (10 points)
            const liveProjects = portfolio.projects.filter(p => p.liveUrl || p.githubUrl).length;
            const liveScore = Math.min(liveProjects * 2, 10);

            // GitHub activity (5 points)
            const githubScore = portfolio.stats.githubStars > 0 ? 5 : 0;

            portfolioScore = qualityScore + linkScore + liveScore + githubScore;
        }

        // Calculate total score
        const totalScore = Math.min(Math.round(projectScore + resumeScore + portfolioScore), 100);

        return {
            totalScore,
            breakdown: {
                projectScore: Math.round(projectScore),
                resumeScore: Math.round(resumeScore),
                portfolioScore: Math.round(portfolioScore)
            }
        };
    } catch (error) {
        console.error('Error calculating skill score:', error);
        return {
            totalScore: 0,
            breakdown: { projectScore: 0, resumeScore: 0, portfolioScore: 0 }
        };
    }
};

/**
 * Update all skills for a user
 */
const updateAllSkills = async (userId) => {
    try {
        const skillPassport = await SkillPassport.findOne({ user: userId });
        if (!skillPassport) return null;

        // Calculate score for each skill
        for (let skill of skillPassport.skills) {
            const { totalScore, breakdown } = await calculateSkillScore(userId, skill.name);
            skill.score = totalScore;
            skill.breakdown = breakdown;
            skill.lastUpdated = new Date();
        }

        // Update skill levels
        skillPassport.updateSkillLevels();

        // Calculate overall score (average of all skills)
        const avgScore = skillPassport.skills.length > 0
            ? skillPassport.skills.reduce((sum, s) => sum + s.score, 0) / skillPassport.skills.length
            : 0;
        skillPassport.overallScore = Math.round(avgScore);

        // Update rank
        skillPassport.updateRank();

        await skillPassport.save();
        return skillPassport;
    } catch (error) {
        console.error('Error updating skills:', error);
        return null;
    }
};

module.exports = {
    calculateSkillScore,
    updateAllSkills
};
