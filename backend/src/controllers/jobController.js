const Job = require('../models/Job');
const matchingService = require('../services/matchingService');
const voiceService = require('../services/voiceService');


/**
 * Create a new job
 */
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      budget,
      locationPreference,
      duration,
      jobType,
      experienceLevel,
      deadline
    } = req.body;

    // Validation
    if (!title || !description || !requiredSkills || !budget) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide title, description, required skills, and budget'
      });
    }

    // Create job
    const job = await Job.create({
      employer: req.user.id,
      title,
      description,
      requiredSkills,
      budget,
      locationPreference,
      duration,
      jobType,
      experienceLevel,
      deadline
    });

    // Populate employer details
    await job.populate('employer', 'name email companyName');

    res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: { job }
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating job'
    });
  }
};

/**
 * Get all jobs (with filters)
 */
exports.getAllJobs = async (req, res) => {
  try {
    const { status, skills, location, minBudget, maxBudget } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'open'; // Default to open jobs
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filter.requiredSkills = { $in: skillsArray };
    }

    if (location) {
      filter.locationPreference = new RegExp(location, 'i');
    }

    if (minBudget || maxBudget) {
      filter['budget.min'] = {};
      if (minBudget) filter['budget.min'].$gte = Number(minBudget);
      if (maxBudget) filter['budget.max'].$lte = Number(maxBudget);
    }

    const jobs = await Job.find(filter)
      .populate('employer', 'name email companyName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: { jobs }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching jobs'
    });
  }
};

/**
 * Get single job by ID
 */
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email companyName location')
      .populate('selectedFreelancer', 'name email skills rating');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching job'
    });
  }
};

/**
 * Get matches for a job (AI-powered)
 */
exports.getJobMatches = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if user is the employer who posted the job
    if (req.user.role === 'employer' && job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only view matches for your own jobs'
      });
    }

    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const matches = await matchingService.findBestMatches(job, limit);

    res.status(200).json({
      status: 'success',
      results: matches.length,
      data: { 
        job: {
          id: job._id,
          title: job.title,
          requiredSkills: job.requiredSkills
        },
        matches 
      }
    });
  } catch (error) {
    console.error('Get job matches error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error finding matches'
    });
  }
};

/**
 * Update job
 */
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if user is the employer who posted the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own jobs'
      });
    }

    const allowedUpdates = ['title', 'description', 'requiredSkills', 'budget', 
                           'locationPreference', 'duration', 'status', 'deadline'];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('employer', 'name email companyName');

    res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
      data: { job: updatedJob }
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating job'
    });
  }
};

/**
 * Delete job
 */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if user is the employer who posted the job
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own jobs'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting job'
    });
  }
};

/**
 * Create job from voice transcript (AI-powered)
 */
exports.createVoiceJob = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide voice transcript'
      });
    }

    // Parse job from transcript
    const parsedJob = voiceService.parseJobFromText(transcript);
    
    // Validate parsed data
    const validation = voiceService.validateParsedJob(parsedJob);
    
    // Generate suggestions
    const suggestions = voiceService.generateSuggestions(transcript);

    // Create job with parsed data
    const job = await Job.create({
      employer: req.user.id,
      ...parsedJob
    });

    // Populate employer details
    await job.populate('employer', 'name email companyName');

    // Get top matches immediately
    const matches = await matchingService.findBestMatches(job, 5);

    res.status(201).json({
      status: 'success',
      message: 'Job created from voice input successfully',
      data: { 
        job,
        validation,
        suggestions,
        topMatches: matches.slice(0, 3) // Show top 3 matches
      }
    });
  } catch (error) {
    console.error('Create voice job error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating job from voice'
    });
  }
};
