const { Notification, User } = require('../models');

// Get all notifications for current user
const getNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;

    const where = { userId: req.userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const unreadCount = await Notification.count({
      where: { userId: req.userId, isRead: false }
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId: req.userId }
    });

    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }

    await notification.update({ isRead: true });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.userId, isRead: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// Delete notification
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, userId: req.userId }
    });

    if (!notification) {
      return res.status(404).json({ error: { message: 'Notification not found' } });
    }

    await notification.destroy();

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// Subscribe to push notifications
const subscribePush = async (req, res, next) => {
  try {
    const { subscription } = req.body;

    await req.user.update({
      pushSubscription: JSON.stringify(subscription)
    });

    res.json({ message: 'Push subscription saved' });
  } catch (error) {
    next(error);
  }
};

// Unsubscribe from push notifications
const unsubscribePush = async (req, res, next) => {
  try {
    await req.user.update({ pushSubscription: null });

    res.json({ message: 'Push subscription removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  subscribePush,
  unsubscribePush
};
