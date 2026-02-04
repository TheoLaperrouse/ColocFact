const { Hono } = require('hono');
const { authenticate } = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

const router = new Hono();

// All routes require authentication
router.use('*', authenticate);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Subscribe to push notifications
router.post('/push/subscribe', notificationController.subscribePush);

// Unsubscribe from push notifications
router.post('/push/unsubscribe', notificationController.unsubscribePush);

module.exports = router;
