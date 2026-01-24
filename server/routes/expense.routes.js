const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all expenses for a group
router.get('/:groupId/expenses', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn([
    'groceries', 'utilities', 'rent', 'internet',
    'entertainment', 'transport', 'household', 'other'
  ]).withMessage('Invalid category'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  validate
], expenseController.getExpenses);

// Get single expense
router.get('/:groupId/expenses/:id', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  param('id').isUUID().withMessage('Invalid expense ID'),
  validate
], expenseController.getExpense);

// Create expense
router.post('/:groupId/expenses', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  body('category')
    .optional()
    .isIn([
      'groceries', 'utilities', 'rent', 'internet',
      'entertainment', 'transport', 'household', 'other'
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('splitType')
    .optional()
    .isIn(['equal', 'percentage', 'exact'])
    .withMessage('Split type must be equal, percentage, or exact'),
  body('paidBy')
    .optional()
    .isUUID()
    .withMessage('Invalid payer ID'),
  body('shares')
    .optional()
    .isArray()
    .withMessage('Shares must be an array'),
  body('shares.*.userId')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID in shares'),
  validate
], expenseController.createExpense);

// Update expense
router.put('/:groupId/expenses/:id', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  param('id').isUUID().withMessage('Invalid expense ID'),
  body('amount')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('category')
    .optional()
    .isIn([
      'groceries', 'utilities', 'rent', 'internet',
      'entertainment', 'transport', 'household', 'other'
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  body('splitType')
    .optional()
    .isIn(['equal', 'percentage', 'exact'])
    .withMessage('Split type must be equal, percentage, or exact'),
  validate
], expenseController.updateExpense);

// Delete expense
router.delete('/:groupId/expenses/:id', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  param('id').isUUID().withMessage('Invalid expense ID'),
  validate
], expenseController.deleteExpense);

module.exports = router;
