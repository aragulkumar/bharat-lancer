const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  budget: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  locationPreference: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance'],
    default: 'freelance'
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert', 'any'],
    default: 'any'
  },
  
  // AI Matching Fields
  embedding: [{
    type: Number
  }],
  keywords: [{
    type: String
  }],
  
  // Job Status
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'closed'],
    default: 'open'
  },
  
  // Applications & Matches
  applications: [{
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  
  selectedFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Voice Input Metadata
  createdViaVoice: {
    type: Boolean,
    default: false
  },
  voiceTranscript: {
    type: String
  },
  
  // Deadlines
  deadline: {
    type: Date
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster searches
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ employer: 1 });
jobSchema.index({ locationPreference: 1 });

// Method to check if job is still open
jobSchema.methods.isOpen = function() {
  return this.status === 'open';
};

// Method to calculate match score with a freelancer
jobSchema.methods.calculateMatchScore = function(freelancer) {
  let score = 0;
  
  // Skill overlap (40 points)
  const jobSkills = this.requiredSkills.map(s => s.toLowerCase());
  const freelancerSkills = freelancer.skills.map(s => s.toLowerCase());
  const skillOverlap = jobSkills.filter(skill => 
    freelancerSkills.includes(skill)
  ).length;
  const skillScore = (skillOverlap / jobSkills.length) * 40;
  score += skillScore;
  
  // Budget fit (30 points)
  if (freelancer.hourlyRate) {
    const avgBudget = (this.budget.min + this.budget.max) / 2;
    const budgetDiff = Math.abs(avgBudget - freelancer.hourlyRate);
    const budgetScore = Math.max(0, 30 - (budgetDiff / avgBudget) * 30);
    score += budgetScore;
  }
  
  // Location match (15 points)
  if (this.locationPreference && freelancer.location) {
    if (this.locationPreference.toLowerCase() === freelancer.location.toLowerCase()) {
      score += 15;
    }
  }
  
  // AI Skill Score (15 points)
  score += (freelancer.aiSkillScore / 100) * 15;
  
  return Math.round(score);
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
