const Message = require('../models/Message');
const User = require('../models/User');

/**
 * Send a message
 */
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, message, jobId } = req.body;
    const messageContent = content || message; // Accept both field names

    if (!receiverId || !messageContent) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide receiver ID and message'
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        status: 'error',
        message: 'Receiver not found'
      });
    }

    // Create message
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      job: jobId,
      message: messageContent
    });

    // Populate sender and receiver details
    await newMessage.populate('sender', 'name email role');
    await newMessage.populate('receiver', 'name email role');

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully',
      data: { message: newMessage }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error sending message'
    });
  }
};

/**
 * Get conversation with a user
 */
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the other user's details
    const otherUser = await User.findById(userId).select('name email role');
    if (!otherUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get all messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id }
      ],
      deletedBy: { $ne: req.user.id } // Exclude messages deleted by current user
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .populate('job', 'title')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    // Format messages to match frontend expectations
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      sender: msg.sender._id,
      receiver: msg.receiver._id,
      content: msg.message, // Map 'message' field to 'content' for frontend
      createdAt: msg.createdAt,
      isRead: msg.isRead
    }));

    // Return conversation object
    const conversation = {
      _id: `${req.user.id}_${userId}`, // Generate conversation ID
      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        role: otherUser.role
      },
      messages: formattedMessages,
      lastMessage: messages.length > 0 ? {
        content: messages[messages.length - 1].message,
        createdAt: messages[messages.length - 1].createdAt
      } : null
    };

    res.status(200).json({
      status: 'success',
      data: { conversation }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching conversation'
    });
  }
};

/**
 * Get all conversations for current user
 */
exports.getAllConversations = async (req, res) => {
  try {
    // Get all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ],
      deletedBy: { $ne: req.user.id } // Exclude messages deleted by current user
    })
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role')
      .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === req.user.id 
        ? msg.receiver._id.toString() 
        : msg.sender._id.toString();
      
      if (!conversationsMap.has(partnerId)) {
        const partner = msg.sender._id.toString() === req.user.id 
          ? msg.receiver 
          : msg.sender;
        
        conversationsMap.set(partnerId, {
          _id: `${req.user.id}_${partnerId}`,
          otherUser: { // Changed from 'partner' to 'otherUser'
            _id: partner._id,
            name: partner.name,
            email: partner.email,
            role: partner.role
          },
          lastMessage: {
            content: msg.message,
            createdAt: msg.createdAt
          },
          unreadCount: 0
        });
      }
    });

    // Count unread messages for each conversation
    for (const [partnerId, conversation] of conversationsMap) {
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        receiver: req.user.id,
        isRead: false
      });
      conversation.unreadCount = unreadCount;
    }

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      status: 'success',
      results: conversations.length,
      data: { conversations }
    });
  } catch (error) {
    console.error('Get all conversations error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching conversations'
    });
  }
};

/**
 * Upload file in chat (demo - watermarking placeholder)
 */
exports.uploadFile = async (req, res) => {
  try {
    const { receiverId, fileName, fileUrl, jobId } = req.body;

    if (!receiverId || !fileName || !fileUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide receiver ID, file name, and file URL'
      });
    }

    // Create message with file
    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      job: jobId,
      message: `Sent a file: ${fileName}`,
      fileUrl,
      fileName,
      fileType: fileName.split('.').pop(),
      isWatermarked: true // Demo: assume watermarked
    });

    await newMessage.populate('sender', 'name email role');
    await newMessage.populate('receiver', 'name email role');

    res.status(201).json({
      status: 'success',
      message: 'File uploaded successfully',
      data: { message: newMessage }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error uploading file'
    });
  }
};

/**
 * Delete a message
 */
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    // Check if user is sender or receiver
    if (message.sender.toString() !== req.user.id && message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete messages from your conversations'
      });
    }

    // Soft delete: add user to deletedBy array
    if (!message.deletedBy.includes(req.user.id)) {
      message.deletedBy.push(req.user.id);
      await message.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error deleting message'
    });
  }
};
