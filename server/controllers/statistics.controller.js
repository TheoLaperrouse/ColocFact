const { Expense, ExpenseShare, Payment, GroupMember, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Check group membership
const checkGroupMembership = async (groupId, userId) => {
  return GroupMember.findOne({ where: { groupId, userId } });
};

// Get overall statistics
const getStatistics = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { startDate, endDate } = c.req.query();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter[Op.gte] = startDate;
    if (endDate) dateFilter[Op.lte] = endDate;
    const where = { groupId };
    if (startDate || endDate) where.date = dateFilter;

    // Total expenses
    const totalExpenses = await Expense.sum('amount', { where }) || 0;

    // Expense count
    const expenseCount = await Expense.count({ where });

    // Average expense
    const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

    // Member count
    const memberCount = await GroupMember.count({ where: { groupId } });

    // Average per person
    const averagePerPerson = memberCount > 0 ? totalExpenses / memberCount : 0;

    // Total confirmed payments
    const paymentWhere = { groupId, status: 'confirmed' };
    if (startDate || endDate) paymentWhere.date = dateFilter;
    const totalPayments = await Payment.sum('amount', { where: paymentWhere }) || 0;

    // Top spender
    const topSpender = await Expense.findOne({
      where,
      attributes: [
        'paidBy',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalSpent']
      ],
      group: ['paidBy'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    return c.json({
      statistics: {
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        expenseCount,
        averageExpense: parseFloat(averageExpense.toFixed(2)),
        memberCount,
        averagePerPerson: parseFloat(averagePerPerson.toFixed(2)),
        totalPayments: parseFloat(totalPayments.toFixed(2)),
        topSpender: topSpender ? {
          user: topSpender.payer,
          totalSpent: parseFloat(topSpender.get('totalSpent'))
        } : null
      }
    });
  } catch (error) {
    throw error;
  }
};

// Get statistics by category
const getStatisticsByCategory = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { startDate, endDate } = c.req.query();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter[Op.gte] = startDate;
    if (endDate) dateFilter[Op.lte] = endDate;
    const where = { groupId };
    if (startDate || endDate) where.date = dateFilter;

    const categoryStats = await Expense.findAll({
      where,
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']]
    });

    const totalAmount = categoryStats.reduce(
      (sum, cat) => sum + parseFloat(cat.get('total')),
      0
    );

    const categories = categoryStats.map(cat => ({
      category: cat.category,
      total: parseFloat(cat.get('total')),
      count: parseInt(cat.get('count')),
      percentage: totalAmount > 0
        ? parseFloat(((cat.get('total') / totalAmount) * 100).toFixed(1))
        : 0
    }));

    return c.json({ categories });
  } catch (error) {
    throw error;
  }
};

// Get statistics by month
const getStatisticsByMonth = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { year } = c.req.query();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const targetYear = year || new Date().getFullYear();

    // SQLite date functions
    const monthlyStats = await Expense.findAll({
      where: {
        groupId,
        date: {
          [Op.gte]: `${targetYear}-01-01`,
          [Op.lte]: `${targetYear}-12-31`
        }
      },
      attributes: [
        [sequelize.fn('strftime', '%m', sequelize.col('date')), 'month'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('strftime', '%m', sequelize.col('date'))],
      order: [[sequelize.fn('strftime', '%m', sequelize.col('date')), 'ASC']]
    });

    // Build complete 12-month array
    const months = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let i = 1; i <= 12; i++) {
      const monthStr = i.toString().padStart(2, '0');
      const stat = monthlyStats.find(s => s.get('month') === monthStr);

      months.push({
        month: i,
        name: monthNames[i - 1],
        total: stat ? parseFloat(stat.get('total')) : 0,
        count: stat ? parseInt(stat.get('count')) : 0
      });
    }

    return c.json({
      year: parseInt(targetYear),
      months
    });
  } catch (error) {
    throw error;
  }
};

// Get statistics by member
const getStatisticsByMember = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { startDate, endDate } = c.req.query();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) dateFilter[Op.gte] = startDate;
    if (endDate) dateFilter[Op.lte] = endDate;
    const where = { groupId };
    if (startDate || endDate) where.date = dateFilter;

    // Get all members
    const members = await GroupMember.findAll({
      where: { groupId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    const memberStats = [];

    for (const member of members) {
      // Amount paid by member
      const totalPaid = await Expense.sum('amount', {
        where: { ...where, paidBy: member.userId }
      }) || 0;

      // Expense count
      const expenseCount = await Expense.count({
        where: { ...where, paidBy: member.userId }
      });

      // Total owed (from shares)
      const shares = await ExpenseShare.findAll({
        where: { userId: member.userId },
        include: [
          {
            model: Expense,
            as: 'expense',
            where,
            required: true
          }
        ]
      });

      const totalOwed = shares.reduce(
        (sum, share) => sum + parseFloat(share.amount),
        0
      );

      memberStats.push({
        user: member.user,
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        totalOwed: parseFloat(totalOwed.toFixed(2)),
        expenseCount,
        balance: parseFloat((totalPaid - totalOwed).toFixed(2))
      });
    }

    // Sort by total paid
    memberStats.sort((a, b) => b.totalPaid - a.totalPaid);

    return c.json({ members: memberStats });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getStatistics,
  getStatisticsByCategory,
  getStatisticsByMonth,
  getStatisticsByMember
};
