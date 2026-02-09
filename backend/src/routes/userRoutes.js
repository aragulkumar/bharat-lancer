const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isFreelancer } = require('../utils/authMiddleware');

// Skill Passport Routes (Freelancer only)
router.get('/skill-passport', protect, isFreelancer, userController.getSkillPassport);
router.post('/skill-passport/update', protect, isFreelancer, userController.updateSkillPassport);

// Utility route for skill extraction
router.post('/extract-skills', protect, userController.extractSkills);

module.exports = router;
