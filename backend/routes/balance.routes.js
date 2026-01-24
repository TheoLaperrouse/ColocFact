const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const balanceController = require('../controllers/balance.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get balances for all members
router.get('/:groupId/balances', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  validate
], balanceController.getBalances);

// Get simplified debts (who owes who)
router.get('/:groupId/debts', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  validate
], balanceController.getDebts);

// Get current user's debts
router.get('/:groupId/debts/me', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  validate
], balanceController.getMyDebts);

// Get all payments
router.get('/:groupId/payments', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  query('status').optional().isIn(['pending', 'confirmed', 'rejected']).withMessage('Invalid status'),
  validate
], balanceController.getPayments);

// Create payment
router.post('/:groupId/payments', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  body('toUser').isUUID().withMessage('Invalid recipient ID'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('note').optional(),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  validate
], balanceController.createPayment);

// Update payment status (confirm/reject)
router.put('/:groupId/payments/:id', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  param('id').isUUID().withMessage('Invalid payment ID'),
  body('status').isIn(['confirmed', 'rejected']).withMessage('Status must be confirmed or rejected'),
  validate
], balanceController.updatePaymentStatus);

// Delete payment
router.delete('/:groupId/payments/:id', [
  param('groupId').isUUID().withMessage('Invalid group ID'),
  param('id').isUUID().withMessage('Invalid payment ID'),
  validate
], balanceController.deletePayment);

module.exports = router;
