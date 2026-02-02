const { Group, GroupMember, User, Expense, ExpenseShare, Payment, sequelize } = require('../models');

// Get all groups for current user
const getGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: User,
          as: 'members',
          through: { attributes: ['role'] },
          attributes: ['id', 'email', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ],
      where: {
        '$members.id$': req.userId
      }
    });

    res.json({ groups });
  } catch (error) {
    next(error);
  }
};

// Get single group
const getGroup = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'members',
          through: { attributes: ['role', 'joinedAt'] },
          attributes: ['id', 'email', 'firstName', 'lastName', 'avatar']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });

    if (!group) {
      return res.status(404).json({ error: { message: 'Group not found' } });
    }

    // Check if user is a member
    const isMember = group.members.some(m => m.id === req.userId);
    if (!isMember) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    res.json({ group });
  } catch (error) {
    next(error);
  }
};

// Create group
const createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const group = await Group.create({
      name,
      description,
      createdBy: req.userId
    });

    // Add creator as admin member
    await GroupMember.create({
      groupId: group.id,
      userId: req.userId,
      role: 'admin'
    });

    // Reload with members
    await group.reload({
      include: [
        {
          model: User,
          as: 'members',
          through: { attributes: ['role'] },
          attributes: ['id', 'email', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    next(error);
  }
};

// Update group
const updateGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: { message: 'Group not found' } });
    }

    // Check if user is admin
    const membership = await GroupMember.findOne({
      where: { groupId: group.id, userId: req.userId }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Only admins can update the group' } });
    }

    await group.update({ name, description });

    res.json({
      message: 'Group updated successfully',
      group
    });
  } catch (error) {
    next(error);
  }
};

// Delete group
const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: { message: 'Group not found' } });
    }

    // Check if user is admin
    const membership = await GroupMember.findOne({
      where: { groupId: group.id, userId: req.userId }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Only admins can delete the group' } });
    }

    // Delete group and all related data in a transaction
    await sequelize.transaction(async (t) => {
      // Get all expense IDs for this group
      const expenses = await Expense.findAll({
        where: { groupId: group.id },
        attributes: ['id'],
        transaction: t
      });
      const expenseIds = expenses.map(e => e.id);

      // Delete expense shares
      if (expenseIds.length > 0) {
        await ExpenseShare.destroy({
          where: { expenseId: expenseIds },
          transaction: t
        });
      }

      // Delete expenses
      await Expense.destroy({
        where: { groupId: group.id },
        transaction: t
      });

      // Delete payments
      await Payment.destroy({
        where: { groupId: group.id },
        transaction: t
      });

      // Delete group members
      await GroupMember.destroy({
        where: { groupId: group.id },
        transaction: t
      });

      // Delete the group
      await group.destroy({ transaction: t });
    });

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Join group via invite code
const joinGroup = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    const group = await Group.findOne({
      where: { inviteCode: inviteCode.toUpperCase() }
    });

    if (!group) {
      return res.status(404).json({ error: { message: 'Invalid invite code' } });
    }

    // Check if already a member
    const existingMembership = await GroupMember.findOne({
      where: { groupId: group.id, userId: req.userId }
    });

    if (existingMembership) {
      return res.status(400).json({ error: { message: 'Already a member of this group' } });
    }

    await GroupMember.create({
      groupId: group.id,
      userId: req.userId,
      role: 'member'
    });

    await group.reload({
      include: [
        {
          model: User,
          as: 'members',
          through: { attributes: ['role'] },
          attributes: ['id', 'email', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.json({
      message: 'Joined group successfully',
      group
    });
  } catch (error) {
    next(error);
  }
};

// Get group members
const getMembers = async (req, res, next) => {
  try {
    const members = await GroupMember.findAll({
      where: { groupId: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.json({ members });
  } catch (error) {
    next(error);
  }
};

// Remove member from group
const removeMember = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params;

    // Check if requester is admin
    const requesterMembership = await GroupMember.findOne({
      where: { groupId, userId: req.userId }
    });

    if (!requesterMembership) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }

    // Allow self-removal or admin removal
    const isSelfRemoval = userId === req.userId;
    const isAdmin = requesterMembership.role === 'admin';

    if (!isSelfRemoval && !isAdmin) {
      return res.status(403).json({ error: { message: 'Only admins can remove other members' } });
    }

    const membership = await GroupMember.findOne({
      where: { groupId, userId }
    });

    if (!membership) {
      return res.status(404).json({ error: { message: 'Member not found' } });
    }

    // Don't allow removing the last admin
    if (membership.role === 'admin') {
      const adminCount = await GroupMember.count({
        where: { groupId, role: 'admin' }
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          error: { message: 'Cannot remove the last admin. Transfer admin rights first.' }
        });
      }
    }

    await membership.destroy();

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

// Update member role
const updateMemberRole = async (req, res, next) => {
  try {
    const { id: groupId, userId } = req.params;
    const { role } = req.body;

    // Check if requester is admin
    const requesterMembership = await GroupMember.findOne({
      where: { groupId, userId: req.userId }
    });

    if (!requesterMembership || requesterMembership.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Only admins can change member roles' } });
    }

    const membership = await GroupMember.findOne({
      where: { groupId, userId }
    });

    if (!membership) {
      return res.status(404).json({ error: { message: 'Member not found' } });
    }

    await membership.update({ role });

    res.json({
      message: 'Member role updated successfully',
      membership
    });
  } catch (error) {
    next(error);
  }
};

// Regenerate invite code
const regenerateInviteCode = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: { message: 'Group not found' } });
    }

    // Check if user is admin
    const membership = await GroupMember.findOne({
      where: { groupId: group.id, userId: req.userId }
    });

    if (!membership || membership.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Only admins can regenerate invite code' } });
    }

    const crypto = require('crypto');
    const newCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    await group.update({ inviteCode: newCode });

    res.json({
      message: 'Invite code regenerated successfully',
      inviteCode: newCode
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  getMembers,
  removeMember,
  updateMemberRole,
  regenerateInviteCode
};
