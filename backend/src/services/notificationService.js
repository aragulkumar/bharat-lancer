const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (userId, type, title, message, relatedData = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedJob: relatedData.jobId,
      relatedUser: relatedData.userId
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send notification when someone applies for a job
exports.sendApplicationNotification = async (job, applicant) => {
  try {
    const title = 'New Job Application';
    const message = `${applicant.name} applied for "${job.title}"`;
    
    await exports.createNotification(
      job.employer,
      'application',
      title,
      message,
      { jobId: job._id, userId: applicant._id }
    );
  } catch (error) {
    console.error('Error sending application notification:', error);
  }
};

// Send notification for skill-matched jobs
exports.sendSkillMatchNotification = async (user, job) => {
  try {
    const matchedSkills = user.skills.filter(skill => 
      job.requiredSkills.some(reqSkill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    const title = 'New Job Matches Your Skills';
    const message = `"${job.title}" matches your skills: ${matchedSkills.slice(0, 3).join(', ')}`;
    
    await exports.createNotification(
      user._id,
      'skill_match',
      title,
      message,
      { jobId: job._id }
    );
  } catch (error) {
    console.error('Error sending skill match notification:', error);
  }
};

// Send notification when employer contacts freelancer
exports.sendContactNotification = async (freelancer, employer, job) => {
  try {
    const title = 'Employer Interested in Your Profile';
    const message = `${employer.name} wants to contact you about "${job.title}"`;
    
    await exports.createNotification(
      freelancer._id,
      'contact',
      title,
      message,
      { jobId: job._id, userId: employer._id }
    );
  } catch (error) {
    console.error('Error sending contact notification:', error);
  }
};

// Get user's notifications
exports.getUserNotifications = async (userId, limit = 20) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .populate('relatedJob', 'title')
      .populate('relatedUser', 'name')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

// Get unread count
exports.getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ 
      user: userId, 
      read: false 
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};

// Mark notification as read
exports.markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all as read
exports.markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
};

// Delete notification
exports.deleteNotification = async (notificationId, userId) => {
  try {
    await Notification.findOneAndDelete({ 
      _id: notificationId, 
      user: userId 
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
