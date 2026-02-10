const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Programming', 'Design', 'Writing', 'Marketing', 'Data', 'DevOps', 'Mobile', 'Other']
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    verified: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    breakdown: {
        projectScore: { type: Number, default: 0, min: 0, max: 40 },
        resumeScore: { type: Number, default: 0, min: 0, max: 30 },
        portfolioScore: { type: Number, default: 0, min: 0, max: 30 }
    }
});

const skillPassportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    skills: [skillSchema],
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    rank: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
    },
    badges: [{
        type: String
    }],
    stats: {
        totalProjects: { type: Number, default: 0 },
        yearsExperience: { type: Number, default: 0 },
        certifications: { type: Number, default: 0 },
        portfolioQuality: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Calculate rank based on overall score
skillPassportSchema.methods.updateRank = function () {
    if (this.overallScore >= 81) this.rank = 'Platinum';
    else if (this.overallScore >= 61) this.rank = 'Gold';
    else if (this.overallScore >= 41) this.rank = 'Silver';
    else this.rank = 'Bronze';
};

// Calculate skill level based on score
skillPassportSchema.methods.updateSkillLevels = function () {
    this.skills.forEach(skill => {
        if (skill.score >= 76) skill.level = 'Expert';
        else if (skill.score >= 51) skill.level = 'Advanced';
        else if (skill.score >= 26) skill.level = 'Intermediate';
        else skill.level = 'Beginner';
    });
};

module.exports = mongoose.model('SkillPassport', skillPassportSchema);
