const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, isEmployer } = require('../utils/authMiddleware');

// Public routes
router.get('/', protect, jobController.getAllJobs);
router.get('/:id', protect, jobController.getJob);

// Employer-only routes
router.post('/', protect, isEmployer, jobController.createJob);
router.post('/voice', protect, isEmployer, jobController.createVoiceJob);
router.put('/:id', protect, isEmployer, jobController.updateJob);
router.delete('/:id', protect, isEmployer, jobController.deleteJob);

// AI Matching route
router.get('/:id/matches', protect, jobController.getJobMatches);

// Application routes
router.post('/:id/apply', protect, jobController.applyForJob);
router.get('/:id/applications', protect, isEmployer, jobController.getJobApplications);

module.exports = router;

