const { Expense, ExpenseShare, Payment, GroupMember, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Calculate balances for all members in a group
 * Positive balance = owed money (others owe this user)
 * Negative balance = owes money (this user owes others)
 */
const calculateBalances = async (groupId) => {
  // Get all group members
  const members = await GroupMember.findAll({
    where: { groupId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'email']
      }
    ]
  });

  // Initialize balances
  const balances = {};
  for (const member of members) {
    balances[member.userId] = {
      user: member.user,
      totalPaid: 0,
      totalOwed: 0,
      balance: 0
    };
  }

  // Get all expenses for the group
  const expenses = await Expense.findAll({
    where: { groupId },
    include: [
      {
        model: ExpenseShare,
        as: 'shares'
      }
    ]
  });

  // Calculate from expenses
  for (const expense of expenses) {
    const payerId = expense.paidBy;
    const amount = parseFloat(expense.amount);

    // Add to payer's total paid
    if (balances[payerId]) {
      balances[payerId].totalPaid += amount;
    }

    // Add shares to each member's total owed
    for (const share of expense.shares) {
      if (balances[share.userId]) {
        balances[share.userId].totalOwed += parseFloat(share.amount);
      }
    }
  }

  // Get all confirmed payments
  const payments = await Payment.findAll({
    where: {
      groupId,
      status: 'confirmed'
    }
  });

  // Adjust for payments
  for (const payment of payments) {
    const amount = parseFloat(payment.amount);
    if (balances[payment.fromUser]) {
      balances[payment.fromUser].totalPaid += amount;
    }
    if (balances[payment.toUser]) {
      balances[payment.toUser].totalOwed += amount;
    }
  }

  // Calculate final balance for each member
  for (const userId in balances) {
    balances[userId].balance = parseFloat(
      (balances[userId].totalPaid - balances[userId].totalOwed).toFixed(2)
    );
    balances[userId].totalPaid = parseFloat(balances[userId].totalPaid.toFixed(2));
    balances[userId].totalOwed = parseFloat(balances[userId].totalOwed.toFixed(2));
  }

  return Object.values(balances);
};

/**
 * Calculate simplified debts using the min-cash-flow algorithm
 * Returns array of transactions: { from, to, amount }
 */
const calculateDebts = async (groupId) => {
  const balances = await calculateBalances(groupId);

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = [];
  const debtors = [];

  for (const balance of balances) {
    if (balance.balance > 0.01) {
      creditors.push({
        user: balance.user,
        amount: balance.balance
      });
    } else if (balance.balance < -0.01) {
      debtors.push({
        user: balance.user,
        amount: Math.abs(balance.balance)
      });
    }
  }

  // Sort by amount (descending) for optimal matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Calculate minimum transactions
  const transactions = [];

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0.01) {
      transactions.push({
        from: debtor.user,
        to: creditor.user,
        amount: parseFloat(amount.toFixed(2))
      });
    }

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) {
      creditors.shift();
    }
    if (debtor.amount < 0.01) {
      debtors.shift();
    }
  }

  return transactions;
};

/**
 * Get user's specific debts (who they owe and who owes them)
 */
const getUserDebts = async (groupId, userId) => {
  const allDebts = await calculateDebts(groupId);

  const owes = allDebts.filter(d => d.from.id === userId);
  const owedBy = allDebts.filter(d => d.to.id === userId);

  const totalOwes = owes.reduce((sum, d) => sum + d.amount, 0);
  const totalOwedBy = owedBy.reduce((sum, d) => sum + d.amount, 0);

  return {
    owes,
    owedBy,
    totalOwes: parseFloat(totalOwes.toFixed(2)),
    totalOwedBy: parseFloat(totalOwedBy.toFixed(2)),
    netBalance: parseFloat((totalOwedBy - totalOwes).toFixed(2))
  };
};

module.exports = {
  calculateBalances,
  calculateDebts,
  getUserDebts
};
