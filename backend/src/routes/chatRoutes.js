const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../utils/authMiddleware');

// All chat routes require authentication
router.post('/send', protect, chatController.sendMessage);
router.post('/upload', protect, chatController.uploadFile);
router.get('/conversations', protect, chatController.getAllConversations);
router.get('/:userId', protect, chatController.getConversation);
router.delete('/:id', protect, chatController.deleteMessage);

module.exports = router;
