const express = require('express');
const { param, query } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const statisticsController = require('../controllers/statistics.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get overall statistics
router.get('/:groupId/statistics', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  validate
], statisticsController.getStatistics);

// Get statistics by category
router.get('/:groupId/statistics/by-category', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  validate
], statisticsController.getStatisticsByCategory);

// Get statistics by month
router.get('/:groupId/statistics/by-month', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  query('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Invalid year'),
  validate
], statisticsController.getStatisticsByMonth);

// Get statistics by member
router.get('/:groupId/statistics/by-member', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  validate
], statisticsController.getStatisticsByMember);

module.exports = router;
