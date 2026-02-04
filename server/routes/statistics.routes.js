const { Hono } = require('hono');
const { authenticate } = require('../middleware/auth.middleware');
const statisticsController = require('../controllers/statistics.controller');

const router = new Hono();

// All routes require authentication
router.use('*', authenticate);

// Get overall statistics
router.get('/:groupId/statistics', statisticsController.getStatistics);

// Get statistics by category
router.get('/:groupId/statistics/by-category', statisticsController.getStatisticsByCategory);

// Get statistics by month
router.get('/:groupId/statistics/by-month', statisticsController.getStatisticsByMonth);

// Get statistics by member
router.get('/:groupId/statistics/by-member', statisticsController.getStatisticsByMember);

module.exports = router;
