const Job = require('../models/Job');
const User = require('../models/User');
const matchingService = require('../services/matchingService');
const voiceService = require('../services/voiceService');
const notificationService = require('../services/notificationService');


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

    // Find and notify matching freelancers
    try {
      const matches = await matchingService.findBestMatches(job, 10);
      
      // Send notifications to top 5 matches
      for (const match of matches.slice(0, 5)) {
        await notificationService.sendSkillMatchNotification(match.freelancer, job);
      }
    } catch (error) {
      console.error('Error sending skill match notifications:', error);
      // Don't fail job creation if notifications fail
    }

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

/**
 * Apply for a job
 */
exports.applyForJob = async (req, res) => {
  try {
    const { coverLetter, proposedRate, estimatedDuration } = req.body;
    const jobId = req.params.id;

    // Check if user is a freelancer
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        status: 'error',
        message: 'Only freelancers can apply for jobs'
      });
    }

    // Find the job
    const job = await Job.findById(jobId).populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if job is still open
    if (job.status !== 'open') {
      return res.status(400).json({
        status: 'error',
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(
      app => app.freelancer.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied for this job'
      });
    }

    // Add application
    job.applications.push({
      freelancer: req.user.id,
      coverLetter,
      proposedRate,
      estimatedDuration,
      status: 'pending'
    });

    await job.save();

    // Get freelancer details for notification
    const freelancer = await User.findById(req.user.id);

    // Send notification to employer
    await notificationService.sendApplicationNotification(job, freelancer);

    res.status(200).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: { 
        jobId: job._id,
        jobTitle: job.title
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error submitting application'
    });
  }
};

/**
 * Get applications for a job (employer only)
 */
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate({
        path: 'applications.freelancer',
        select: 'name email skills hourlyRate aiSkillScore location'
      });

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if user is the employer
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only view applications for your own jobs'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        jobTitle: job.title,
        applications: job.applications
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching applications'
    });
  }
};

/**
 * Contact a freelancer (employer only)
 */
exports.contactFreelancer = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const freelancerId = req.params.freelancerId;

    // Get job and verify employer
    const job = await Job.findById(jobId).populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Check if user is the employer
    if (job.employer._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Only the job employer can contact freelancers'
      });
    }

    // Get freelancer details
    const freelancer = await User.findById(freelancerId);

    if (!freelancer) {
      return res.status(404).json({
        status: 'error',
        message: 'Freelancer not found'
      });
    }

    // Send notification to freelancer
    await notificationService.sendContactNotification(freelancer, job.employer, job);

    res.status(200).json({
      status: 'success',
      message: 'Contact request sent successfully'
    });
  } catch (error) {
    console.error('Contact freelancer error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error contacting freelancer'
    });
  }
};

