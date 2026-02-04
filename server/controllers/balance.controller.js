const { Payment, GroupMember, User, sequelize } = require('../models');
const debtService = require('../services/debt.service');

// Check group membership
const checkGroupMembership = async (groupId, userId) => {
  return GroupMember.findOne({ where: { groupId, userId } });
};

// Get balances for all group members
const getBalances = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const balances = await debtService.calculateBalances(groupId);

    return c.json({ balances });
  } catch (error) {
    throw error;
  }
};

// Get simplified debts (who owes who)
const getDebts = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const debts = await debtService.calculateDebts(groupId);

    return c.json({ debts });
  } catch (error) {
    throw error;
  }
};

// Get current user's debts in the group
const getMyDebts = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const userDebts = await debtService.getUserDebts(groupId, userId);

    return c.json(userDebts);
  } catch (error) {
    throw error;
  }
};

// Get all payments for a group
const getPayments = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { status } = c.req.query();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const where = { groupId };
    if (status) where.status = status;

    const payments = await Payment.findAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return c.json({ payments });
  } catch (error) {
    throw error;
  }
};

// Create payment
const createPayment = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const { toUser, amount, note, date } = await c.req.json();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Verify recipient is a group member
    const recipientMembership = await checkGroupMembership(groupId, toUser);
    if (!recipientMembership) {
      return c.json({ error: { message: 'Recipient must be a group member' } }, 400);
    }

    // Can't pay yourself
    if (toUser === userId) {
      return c.json({ error: { message: 'Cannot create payment to yourself' } }, 400);
    }

    const payment = await Payment.create({
      groupId,
      fromUser: userId,
      toUser,
      amount,
      note,
      date: date || new Date(),
      status: 'pending'
    });

    await payment.reload({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    return c.json({
      message: 'Payment created successfully',
      payment
    }, 201);
  } catch (error) {
    throw error;
  }
};

// Confirm or reject payment
const updatePaymentStatus = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const id = c.req.param('id');
    const { status } = await c.req.json();

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const payment = await Payment.findOne({
      where: { id, groupId }
    });

    if (!payment) {
      return c.json({ error: { message: 'Payment not found' } }, 404);
    }

    // Only the receiver can confirm/reject
    if (payment.toUser !== userId) {
      return c.json({
        error: { message: 'Only the payment receiver can confirm or reject' }
      }, 403);
    }

    if (payment.status !== 'pending') {
      return c.json({
        error: { message: 'Payment has already been processed' }
      }, 400);
    }

    await payment.update({ status });

    await payment.reload({
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    return c.json({
      message: `Payment ${status}`,
      payment
    });
  } catch (error) {
    throw error;
  }
};

// Delete payment (only pending payments by sender)
const deletePayment = async (c) => {
  try {
    const userId = c.get('userId');
    const groupId = c.req.param('groupId');
    const id = c.req.param('id');

    const membership = await checkGroupMembership(groupId, userId);
    if (!membership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    const payment = await Payment.findOne({
      where: { id, groupId }
    });

    if (!payment) {
      return c.json({ error: { message: 'Payment not found' } }, 404);
    }

    // Only sender can delete, and only pending payments
    if (payment.fromUser !== userId && membership.role !== 'admin') {
      return c.json({
        error: { message: 'Only the sender or admin can delete this payment' }
      }, 403);
    }

    if (payment.status !== 'pending') {
      return c.json({
        error: { message: 'Cannot delete a payment that has been processed' }
      }, 400);
    }

    await payment.destroy();

    return c.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBalances,
  getDebts,
  getMyDebts,
  getPayments,
  createPayment,
  updatePaymentStatus,
  deletePayment
};
