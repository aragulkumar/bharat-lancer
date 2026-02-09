const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { protect } = require('../utils/authMiddleware');

/**
 * POST /api/ai/voice-to-job
 * Process voice transcript and extract job details
 */
router.post('/voice-to-job', protect, async (req, res) => {
    try {
        const { transcript, language } = req.body;

        if (!transcript) {
            return res.status(400).json({
                status: 'error',
                message: 'Transcript is required'
            });
        }

        // Process voice input
        const jobDetails = await aiService.processVoiceToJob(transcript, language || 'en');

        // Find matching freelancers
        const matchedFreelancers = await aiService.findMatchingFreelancers(
            jobDetails.requiredSkills,
            jobDetails.budget
        );

        res.status(200).json({
            status: 'success',
            data: {
                jobDetails,
                matchedFreelancers
            }
        });
    } catch (error) {
        console.error('Voice-to-job error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error processing voice input'
        });
    }
});

module.exports = router;
