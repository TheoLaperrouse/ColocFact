const express = require('express');
const { param, body, query } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all notifications
router.get('/', [
  query('unreadOnly').optional().isBoolean().withMessage('unreadOnly must be boolean'),
  validate
], notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', [
  param('id').isUUID().withMessage('Invalid notification ID'),
  validate
], notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid notification ID'),
  validate
], notificationController.deleteNotification);

// Subscribe to push notifications
router.post('/push/subscribe', [
  body('subscription').notEmpty().withMessage('Subscription is required'),
  validate
], notificationController.subscribePush);

// Unsubscribe from push notifications
router.post('/push/unsubscribe', notificationController.unsubscribePush);

module.exports = router;
