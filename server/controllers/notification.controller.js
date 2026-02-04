const { Notification, User } = require('../models');

// Get all notifications for current user
const getNotifications = async (c) => {
  try {
    const userId = c.get('userId');
    const { unreadOnly } = c.req.query();

    const where = { userId };
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const unreadCount = await Notification.count({
      where: { userId, isRead: false }
    });

    return c.json({ notifications, unreadCount });
  } catch (error) {
    throw error;
  }
};

// Mark notification as read
const markAsRead = async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return c.json({ error: { message: 'Notification not found' } }, 404);
    }

    await notification.update({ isRead: true });

    return c.json({ message: 'Notification marked as read' });
  } catch (error) {
    throw error;
  }
};

// Mark all notifications as read
const markAllAsRead = async (c) => {
  try {
    const userId = c.get('userId');

    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );

    return c.json({ message: 'All notifications marked as read' });
  } catch (error) {
    throw error;
  }
};

// Delete notification
const deleteNotification = async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return c.json({ error: { message: 'Notification not found' } }, 404);
    }

    await notification.destroy();

    return c.json({ message: 'Notification deleted' });
  } catch (error) {
    throw error;
  }
};

// Subscribe to push notifications
const subscribePush = async (c) => {
  try {
    const user = c.get('user');
    const { subscription } = await c.req.json();

    await user.update({
      pushSubscription: JSON.stringify(subscription)
    });

    return c.json({ message: 'Push subscription saved' });
  } catch (error) {
    throw error;
  }
};

// Unsubscribe from push notifications
const unsubscribePush = async (c) => {
  try {
    const user = c.get('user');

    await user.update({ pushSubscription: null });

    return c.json({ message: 'Push subscription removed' });
  } catch (error) {
    throw error;
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
