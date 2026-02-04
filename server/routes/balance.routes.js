const { Hono } = require('hono');
const { authenticate } = require('../middleware/auth.middleware');
const balanceController = require('../controllers/balance.controller');

const router = new Hono();

// All routes require authentication
router.use('*', authenticate);

// Get balances for all members
router.get('/:groupId/balances', balanceController.getBalances);

// Get simplified debts (who owes who)
router.get('/:groupId/debts', balanceController.getDebts);

// Get current user's debts
router.get('/:groupId/debts/me', balanceController.getMyDebts);

// Get all payments
router.get('/:groupId/payments', balanceController.getPayments);

// Create payment
router.post('/:groupId/payments', balanceController.createPayment);

// Update payment status (confirm/reject)
router.put('/:groupId/payments/:id', balanceController.updatePaymentStatus);

// Delete payment
router.delete('/:groupId/payments/:id', balanceController.deletePayment);

module.exports = router;
