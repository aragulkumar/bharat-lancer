const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');
// const { protect } = require('../middleware/authMiddleware');

// Parse job from voice transcript (auth temporarily disabled for testing)
router.post('/parse-job', geminiController.parseJobFromVoice);

module.exports = router;
