const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        trim: true
    }],
    role: {
        type: String,
        trim: true
    },
    duration: {
        type: String
    },
    images: [{
        type: String
    }],
    liveUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true
    },
    impact: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    complexity: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    projects: [projectSchema],
    links: {
        github: { type: String, trim: true },
        linkedin: { type: String, trim: true },
        website: { type: String, trim: true },
        behance: { type: String, trim: true },
        dribbble: { type: String, trim: true },
        medium: { type: String, trim: true }
    },
    bio: {
        type: String,
        maxlength: 500
    },
    stats: {
        totalProjects: { type: Number, default: 0 },
        featuredProjects: { type: Number, default: 0 },
        githubStars: { type: Number, default: 0 },
        githubRepos: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Update stats when projects change
portfolioSchema.methods.updateStats = function () {
    this.stats.totalProjects = this.projects.length;
    this.stats.featuredProjects = this.projects.filter(p => p.featured).length;
};

module.exports = mongoose.model('Portfolio', portfolioSchema);
