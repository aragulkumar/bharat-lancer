const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['freelancer', 'employer'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  
  // Freelancer-specific fields
  skills: [{
    type: String,
    trim: true
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'flexible'],
    default: 'flexible'
  },
  portfolioLinks: [{
    type: String,
    trim: true
  }],
  resumeText: {
    type: String
  },
  
  // AI Skill Passport Fields
  aiSkillScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  verifiedSkills: [{
    skill: String,
    score: Number,
    verifiedAt: Date
  }],
  projectCount: {
    type: Number,
    default: 0
  },
  
  // Employer-specific fields
  companyName: {
    type: String,
    trim: true
  },
  companyDescription: {
    type: String
  },
  
  // Common fields
  profilePicture: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update skill score
userSchema.methods.updateSkillScore = function() {
  // Weighted scoring algorithm
  const projectScore = Math.min(this.projectCount * 10, 40); // Max 40 points
  const portfolioScore = Math.min(this.portfolioLinks.length * 10, 30); // Max 30 points
  const resumeScore = this.resumeText ? 30 : 0; // Max 30 points
  
  this.aiSkillScore = projectScore + portfolioScore + resumeScore;
  return this.aiSkillScore;
};

// Method to get public profile (exclude sensitive data)
userSchema.methods.toPublicProfile = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
