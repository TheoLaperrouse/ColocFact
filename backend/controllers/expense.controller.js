const { Expense, ExpenseShare, GroupMember, User, Group, sequelize } = require('../models');
const { Op } = require('sequelize');

// Check if user is member of group
const checkGroupMembership = async (groupId, userId) => {
  const membership = await GroupMember.findOne({
    where: { groupId, userId }
  });
  return membership;
};

// Get all expenses for a group
const getExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;

    // Check membership
    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Build where clause
    const where = { groupId };
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const offset = (page - 1) * limit;

    const { count, rows: expenses } = await Expense.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: ExpenseShare,
          as: 'shares',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ]
        }
      ],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single expense
const getExpense = async (req, res, next) => {
  try {
    const { groupId, id } = req.params;

    // Check membership
    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const expense = await Expense.findOne({
      where: { id, groupId },
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar', 'email']
        },
        {
          model: ExpenseShare,
          as: 'shares',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar', 'email']
            }
          ]
        }
      ]
    });

    if (!expense) {
      return res.status(404).json({ error: { message: 'Expense not found' } });
    }

    res.json({ expense });
  } catch (error) {
    next(error);
  }
};

// Create expense
const createExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { groupId } = req.params;
    const { amount, description, category, date, splitType, shares, paidBy } = req.body;

    // Check membership
    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      await transaction.rollback();
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Determine who paid (default to current user)
    const payerId = paidBy || req.userId;

    // Verify payer is a group member
    const payerMembership = await checkGroupMembership(groupId, payerId);
    if (!payerMembership) {
      await transaction.rollback();
      return res.status(400).json({ error: { message: 'Payer must be a group member' } });
    }

    // Create expense
    const expense = await Expense.create({
      groupId,
      paidBy: payerId,
      amount,
      description,
      category: category || 'other',
      date: date || new Date(),
      splitType: splitType || 'equal'
    }, { transaction });

    // Handle shares based on split type
    let expenseShares = [];

    if (splitType === 'equal' || !shares || shares.length === 0) {
      // Get all group members
      const members = await GroupMember.findAll({
        where: { groupId },
        transaction
      });

      const shareAmount = parseFloat((amount / members.length).toFixed(2));
      let remainder = parseFloat((amount - shareAmount * members.length).toFixed(2));

      for (const member of members) {
        let memberShare = shareAmount;
        if (remainder > 0) {
          memberShare = parseFloat((memberShare + 0.01).toFixed(2));
          remainder = parseFloat((remainder - 0.01).toFixed(2));
        }

        expenseShares.push({
          expenseId: expense.id,
          userId: member.userId,
          amount: memberShare
        });
      }
    } else if (splitType === 'percentage') {
      // Shares should contain userId and percentage
      const totalPercentage = shares.reduce((sum, s) => sum + s.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        await transaction.rollback();
        return res.status(400).json({
          error: { message: 'Percentages must sum to 100' }
        });
      }

      for (const share of shares) {
        expenseShares.push({
          expenseId: expense.id,
          userId: share.userId,
          amount: parseFloat(((share.percentage / 100) * amount).toFixed(2))
        });
      }
    } else if (splitType === 'exact') {
      // Shares should contain userId and exact amount
      const totalShares = shares.reduce((sum, s) => sum + parseFloat(s.amount), 0);
      if (Math.abs(totalShares - parseFloat(amount)) > 0.01) {
        await transaction.rollback();
        return res.status(400).json({
          error: { message: 'Share amounts must sum to total expense amount' }
        });
      }

      for (const share of shares) {
        expenseShares.push({
          expenseId: expense.id,
          userId: share.userId,
          amount: parseFloat(share.amount)
        });
      }
    }

    await ExpenseShare.bulkCreate(expenseShares, { transaction });
    await transaction.commit();

    // Reload expense with shares
    await expense.reload({
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: ExpenseShare,
          as: 'shares',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Update expense
const updateExpense = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { groupId, id } = req.params;
    const { amount, description, category, date, splitType, shares, paidBy } = req.body;

    // Check membership
    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      await transaction.rollback();
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const expense = await Expense.findOne({
      where: { id, groupId },
      transaction
    });

    if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ error: { message: 'Expense not found' } });
    }

    // Only payer or admin can update
    if (expense.paidBy !== req.userId && membership.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({
        error: { message: 'Only the payer or admin can update this expense' }
      });
    }

    // Update expense
    const updates = {};
    if (amount !== undefined) updates.amount = amount;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (date !== undefined) updates.date = date;
    if (splitType !== undefined) updates.splitType = splitType;
    if (paidBy !== undefined) {
      const payerMembership = await checkGroupMembership(groupId, paidBy);
      if (!payerMembership) {
        await transaction.rollback();
        return res.status(400).json({ error: { message: 'Payer must be a group member' } });
      }
      updates.paidBy = paidBy;
    }

    await expense.update(updates, { transaction });

    // If shares are provided, update them
    if (shares && shares.length > 0) {
      await ExpenseShare.destroy({
        where: { expenseId: expense.id },
        transaction
      });

      const expenseAmount = amount || expense.amount;
      let expenseShares = [];

      if (expense.splitType === 'percentage' || splitType === 'percentage') {
        const totalPercentage = shares.reduce((sum, s) => sum + s.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
          await transaction.rollback();
          return res.status(400).json({
            error: { message: 'Percentages must sum to 100' }
          });
        }

        for (const share of shares) {
          expenseShares.push({
            expenseId: expense.id,
            userId: share.userId,
            amount: parseFloat(((share.percentage / 100) * expenseAmount).toFixed(2))
          });
        }
      } else if (expense.splitType === 'exact' || splitType === 'exact') {
        const totalShares = shares.reduce((sum, s) => sum + parseFloat(s.amount), 0);
        if (Math.abs(totalShares - parseFloat(expenseAmount)) > 0.01) {
          await transaction.rollback();
          return res.status(400).json({
            error: { message: 'Share amounts must sum to total expense amount' }
          });
        }

        for (const share of shares) {
          expenseShares.push({
            expenseId: expense.id,
            userId: share.userId,
            amount: parseFloat(share.amount)
          });
        }
      }

      if (expenseShares.length > 0) {
        await ExpenseShare.bulkCreate(expenseShares, { transaction });
      }
    }

    await transaction.commit();

    // Reload expense
    await expense.reload({
      include: [
        {
          model: User,
          as: 'payer',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: ExpenseShare,
          as: 'shares',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Delete expense
const deleteExpense = async (req, res, next) => {
  try {
    const { groupId, id } = req.params;

    // Check membership
    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const expense = await Expense.findOne({
      where: { id, groupId }
    });

    if (!expense) {
      return res.status(404).json({ error: { message: 'Expense not found' } });
    }

    // Only payer or admin can delete
    if (expense.paidBy !== req.userId && membership.role !== 'admin') {
      return res.status(403).json({
        error: { message: 'Only the payer or admin can delete this expense' }
      });
    }

    await expense.destroy();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense
};
