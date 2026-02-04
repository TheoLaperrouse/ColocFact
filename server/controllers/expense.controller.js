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
const getExpenses = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { page = '1', limit = '20', category, startDate, endDate } = c.req.query();

    // Check membership
    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Build where clause
    const where = { groupId };
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

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

    return c.json({
      expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    throw error;
  }
};

// Get single expense
const getExpense = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const id = c.req.param('id');

    // Check membership
    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
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
      return c.json({ error: { message: 'Expense not found' } }, 404);
    }

    return c.json({ expense });
  } catch (error) {
    throw error;
  }
};

// Create expense
const createExpense = async (c) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { amount, description, category, date, splitType, shares, paidBy } = await c.req.json();

    // Check membership
    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      await transaction.rollback();
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Determine who paid (default to current user)
    const payerId = paidBy || userId;

    // Verify payer is a group member
    const payerMembership = await checkGroupMembership(groupId, payerId);
    if (!payerMembership) {
      await transaction.rollback();
      return c.json({ error: { message: 'Payer must be a group member' } }, 400);
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
        return c.json({
          error: { message: 'Percentages must sum to 100' }
        }, 400);
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
        return c.json({
          error: { message: 'Share amounts must sum to total expense amount' }
        }, 400);
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

    return c.json({
      message: 'Expense created successfully',
      expense
    }, 201);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Update expense
const updateExpense = async (c) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const id = c.req.param('id');
    const { amount, description, category, date, splitType, shares, paidBy } = await c.req.json();

    // Check membership
    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      await transaction.rollback();
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const expense = await Expense.findOne({
      where: { id, groupId },
      transaction
    });

    if (!expense) {
      await transaction.rollback();
      return c.json({ error: { message: 'Expense not found' } }, 404);
    }

    // Only payer or admin can update
    if (expense.paidBy !== userId && membership.role !== 'admin') {
      await transaction.rollback();
      return c.json({
        error: { message: 'Only the payer or admin can update this expense' }
      }, 403);
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
        return c.json({ error: { message: 'Payer must be a group member' } }, 400);
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
          return c.json({
            error: { message: 'Percentages must sum to 100' }
          }, 400);
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
          return c.json({
            error: { message: 'Share amounts must sum to total expense amount' }
          }, 400);
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

    return c.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Delete expense
const deleteExpense = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const id = c.req.param('id');

    // Check membership
    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const expense = await Expense.findOne({
      where: { id, groupId }
    });

    if (!expense) {
      return c.json({ error: { message: 'Expense not found' } }, 404);
    }

    // Only payer or admin can delete
    if (expense.paidBy !== userId && membership.role !== 'admin') {
      return c.json({
        error: { message: 'Only the payer or admin can delete this expense' }
      }, 403);
    }

    // Delete expense and related shares in a transaction
    await sequelize.transaction(async (t) => {
      await ExpenseShare.destroy({
        where: { expenseId: id },
        transaction: t
      });
      await expense.destroy({ transaction: t });
    });

    return c.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense
};
