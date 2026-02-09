const notificationService = require('../services/notificationService');

// Get user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    const unreadCount = await notificationService.getUnreadCount(req.user.id);

    res.status(200).json({
      status: 'success',
      data: {
        notifications,
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch notifications'
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);

    res.status(200).json({
      status: 'success',
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get unread count'
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark as read'
    });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark all as read'
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete notification'
    });
  }
};
