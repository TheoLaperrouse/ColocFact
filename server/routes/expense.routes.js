const { Hono } = require('hono');
const { authenticate } = require('../middleware/auth.middleware');
const expenseController = require('../controllers/expense.controller');

const router = new Hono();

// All routes require authentication
router.use('*', authenticate);

// Get all expenses for a group
router.get('/:groupId/expenses', expenseController.getExpenses);

// Get single expense
router.get('/:groupId/expenses/:id', expenseController.getExpense);

// Create expense
router.post('/:groupId/expenses', expenseController.createExpense);

// Update expense
router.put('/:groupId/expenses/:id', expenseController.updateExpense);

// Delete expense
router.delete('/:groupId/expenses/:id', expenseController.deleteExpense);

module.exports = router;
