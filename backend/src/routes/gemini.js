const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');
const { protect } = require('../middleware/authMiddleware');

// Parse job from voice transcript
router.post('/parse-job', protect, geminiController.parseJobFromVoice);

module.exports = router;
