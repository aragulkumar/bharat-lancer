const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    technologies: [{
        type: String,
        trim: true
    }],
    current: {
        type: Boolean,
        default: false
    }
});

const educationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    field: {
        type: String,
        trim: true
    },
    year: {
        type: String
    },
    grade: {
        type: String
    }
});

const certificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    issuer: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String
    },
    credentialUrl: {
        type: String,
        trim: true
    },
    expiryDate: {
        type: String
    }
});

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [certificationSchema],
    skills: [{
        type: String,
        trim: true
    }],
    fileUrl: {
        type: String
    },
    parsedText: {
        type: String
    },
    summary: {
        type: String,
        maxlength: 1000
    },
    stats: {
        yearsExperience: { type: Number, default: 0 },
        educationLevel: { type: String, default: 'Bachelor' },
        certificationCount: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Calculate years of experience
resumeSchema.methods.calculateExperience = function () {
    let totalMonths = 0;
    this.experience.forEach(exp => {
        // Simple calculation - can be enhanced
        const duration = exp.duration.toLowerCase();
        if (duration.includes('year')) {
            const years = parseInt(duration.match(/\d+/)?.[0] || 0);
            totalMonths += years * 12;
        }
    });
    this.stats.yearsExperience = Math.floor(totalMonths / 12);
};

// Update stats
resumeSchema.methods.updateStats = function () {
    this.calculateExperience();
    this.stats.certificationCount = this.certifications.length;
};

module.exports = mongoose.model('Resume', resumeSchema);
