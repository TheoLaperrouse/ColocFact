const { Payment, GroupMember, User, sequelize } = require('../models');
const debtService = require('../services/debt.service');

// Check group membership
const checkGroupMembership = async (groupId, userId) => {
  return GroupMember.findOne({ where: { groupId, userId } });
};

// Get balances for all group members
const getBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const balances = await debtService.calculateBalances(groupId);

    res.json({ balances });
  } catch (error) {
    next(error);
  }
};

// Get simplified debts (who owes who)
const getDebts = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const debts = await debtService.calculateDebts(groupId);

    res.json({ debts });
  } catch (error) {
    next(error);
  }
};

// Get current user's debts in the group
const getMyDebts = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const userDebts = await debtService.getUserDebts(groupId, req.userId);

    res.json(userDebts);
  } catch (error) {
    next(error);
  }
};

// Get all payments for a group
const getPayments = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { status } = req.query;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
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

    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

// Create payment
const createPayment = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { toUser, amount, note, date } = req.body;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Verify recipient is a group member
    const recipientMembership = await checkGroupMembership(groupId, toUser);
    if (!recipientMembership) {
      return res.status(400).json({ error: { message: 'Recipient must be a group member' } });
    }

    // Can't pay yourself
    if (toUser === req.userId) {
      return res.status(400).json({ error: { message: 'Cannot create payment to yourself' } });
    }

    const payment = await Payment.create({
      groupId,
      fromUser: req.userId,
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

    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Confirm or reject payment
const updatePaymentStatus = async (req, res, next) => {
  try {
    const { groupId, id } = req.params;
    const { status } = req.body;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const payment = await Payment.findOne({
      where: { id, groupId }
    });

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Only the receiver can confirm/reject
    if (payment.toUser !== req.userId) {
      return res.status(403).json({
        error: { message: 'Only the payment receiver can confirm or reject' }
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        error: { message: 'Payment has already been processed' }
      });
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

    res.json({
      message: `Payment ${status}`,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Delete payment (only pending payments by sender)
const deletePayment = async (req, res, next) => {
  try {
    const { groupId, id } = req.params;

    const membership = await checkGroupMembership(groupId, req.userId);
    if (!membership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    const payment = await Payment.findOne({
      where: { id, groupId }
    });

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } });
    }

    // Only sender can delete, and only pending payments
    if (payment.fromUser !== req.userId && membership.role !== 'admin') {
      return res.status(403).json({
        error: { message: 'Only the sender or admin can delete this payment' }
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        error: { message: 'Cannot delete a payment that has been processed' }
      });
    }

    await payment.destroy();

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
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
