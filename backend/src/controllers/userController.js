const User = require('../models/User');
const skillService = require('../services/skillService');

/**
 * Get user's skill passport
 */
exports.getSkillPassport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.role !== 'freelancer') {
      return res.status(403).json({
        status: 'error',
        message: 'Skill passport is only available for freelancers'
      });
    }

    const passport = skillService.generateSkillPassport(user);

    res.status(200).json({
      status: 'success',
      data: { passport }
    });
  } catch (error) {
    console.error('Get skill passport error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating skill passport'
    });
  }
};

/**
 * Update skill passport (recalculate scores)
 */
exports.updateSkillPassport = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    if (user.role !== 'freelancer') {
      return res.status(403).json({
        status: 'error',
        message: 'Skill passport is only available for freelancers'
      });
    }

    // Update skill passport
    user = await skillService.updateUserSkillPassport(user);

    const passport = skillService.generateSkillPassport(user);

    res.status(200).json({
      status: 'success',
      message: 'Skill passport updated successfully',
      data: { 
        passport,
        user: user.toPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update skill passport error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error updating skill passport'
    });
  }
};

/**
 * Extract skills from text (for testing/preview)
 */
exports.extractSkills = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide text to extract skills from'
      });
    }

    const skills = skillService.extractSkills(text);

    res.status(200).json({
      status: 'success',
      data: { 
        skills,
        count: skills.length
      }
    });
  } catch (error) {
    console.error('Extract skills error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error extracting skills'
    });
  }
};
