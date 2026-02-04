const { Group, GroupMember, User, Expense, ExpenseShare, Payment, sequelize } = require('../models');

// Get all groups for current user
const getGroups = async (c) => {
  try {
    const userId = c.get('userId');
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
        '$members.id$': userId
      }
    });

    return c.json({ groups });
  } catch (error) {
    throw error;
  }
};

// Get single group
const getGroup = async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const group = await Group.findByPk(id, {
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
      return c.json({ error: { message: 'Group not found' } }, 404);
    }

    // Check if user is a member
    const isMember = group.members.some(m => m.id === userId);
    if (!isMember) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    return c.json({ group });
  } catch (error) {
    throw error;
  }
};

// Create group
const createGroup = async (c) => {
  try {
    const userId = c.get('userId');
    const { name, description } = await c.req.json();

    const group = await Group.create({
      name,
      description,
      createdBy: userId
    });

    // Add creator as admin member
    await GroupMember.create({
      groupId: group.id,
      userId: userId,
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

    return c.json({
      message: 'Group created successfully',
      group
    }, 201);
  } catch (error) {
    throw error;
  }
};

// Update group
const updateGroup = async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');
    const { name, description } = await c.req.json();

    const group = await Group.findByPk(id);

    if (!group) {
      return c.json({ error: { message: 'Group not found' } }, 404);
    }

    // Check if user is admin
    const membership = await GroupMember.findOne({
      where: { groupId: group.id, userId: userId }
    });

    if (!membership || membership.role !== 'admin') {
      return c.json({ error: { message: 'Only admins can update the group' } }, 403);
    }

    await group.update({ name, description });

    return c.json({
      message: 'Group updated successfully',
      group
    });
  } catch (error) {
    throw error;
  }
};

// Delete group
const deleteGroup = async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const group = await Group.findByPk(id);

    if (!group) {
      return c.json({ error: { message: 'Group not found' } }, 404);
    }

    // Check if user is admin
    const membership = await GroupMember.findOne({
      where: { groupId: group.id, userId: userId }
    });

    if (!membership || membership.role !== 'admin') {
      return c.json({ error: { message: 'Only admins can delete the group' } }, 403);
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

    return c.json({ message: 'Group deleted successfully' });
  } catch (error) {
    throw error;
  }
};

// Join group via invite code
const joinGroup = async (c) => {
  try {
    const userId = c.get('userId');
    const { inviteCode } = await c.req.json();

    const group = await Group.findOne({
      where: { inviteCode: inviteCode.toUpperCase() }
    });

    if (!group) {
      return c.json({ error: { message: 'Invalid invite code' } }, 404);
    }

    // Check if already a member
    const existingMembership = await GroupMember.findOne({
      where: { groupId: group.id, userId: userId }
    });

    if (existingMembership) {
      return c.json({ error: { message: 'Already a member of this group' } }, 400);
    }

    await GroupMember.create({
      groupId: group.id,
      userId: userId,
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

    return c.json({
      message: 'Joined group successfully',
      group
    });
  } catch (error) {
    throw error;
  }
};

// Get group members
const getMembers = async (c) => {
  try {
    const id = c.req.param('id');

    const members = await GroupMember.findAll({
      where: { groupId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    return c.json({ members });
  } catch (error) {
    throw error;
  }
};

// Remove member from group
const removeMember = async (c) => {
  try {
    const reqUserId = c.get('userId');
    const groupId = c.req.param('id');
    const userId = c.req.param('userId');

    // Check if requester is admin
    const requesterMembership = await GroupMember.findOne({
      where: { groupId, userId: reqUserId }
    });

    if (!requesterMembership) {
      return c.json({ error: { message: 'Access denied' } }, 403);
    }

    // Allow self-removal or admin removal
    const isSelfRemoval = userId === reqUserId;
    const isAdmin = requesterMembership.role === 'admin';

    if (!isSelfRemoval && !isAdmin) {
      return c.json({ error: { message: 'Only admins can remove other members' } }, 403);
    }

    const membership = await GroupMember.findOne({
      where: { groupId, userId }
    });

    if (!membership) {
      return c.json({ error: { message: 'Member not found' } }, 404);
    }

    // Don't allow removing the last admin
    if (membership.role === 'admin') {
      const adminCount = await GroupMember.count({
        where: { groupId, role: 'admin' }
      });

      if (adminCount <= 1) {
        return c.json({
          error: { message: 'Cannot remove the last admin. Transfer admin rights first.' }
        }, 400);
      }
    }

    await membership.destroy();

    return c.json({ message: 'Member removed successfully' });
  } catch (error) {
    throw error;
  }
};

// Update member role
const updateMemberRole = async (c) => {
  try {
    const reqUserId = c.get('userId');
    const groupId = c.req.param('id');
    const userId = c.req.param('userId');
    const { role } = await c.req.json();

    // Check if requester is admin
    const requesterMembership = await GroupMember.findOne({
      where: { groupId, userId: reqUserId }
    });

    if (!requesterMembership || requesterMembership.role !== 'admin') {
      return c.json({ error: { message: 'Only admins can change member roles' } }, 403);
    }

    const membership = await GroupMember.findOne({
      where: { groupId, userId }
    });

    if (!membership) {
      return c.json({ error: { message: 'Member not found' } }, 404);
    }

    await membership.update({ role });

    return c.json({
      message: 'Member role updated successfully',
      membership
    });
  } catch (error) {
    throw error;
  }
};

// Regenerate invite code
const regenerateInviteCode = async (c) => {
  try {
    const userId = c.get('userId');
    const id = c.req.param('id');

    const group = await Group.findByPk(id);

    if (!group) {
      return c.json({ error: { message: 'Group not found' } }, 404);
    }

    // Check if user is admin
    const membership = await GroupMember.findOne({
      where: { groupId: group.id, userId: userId }
    });

    if (!membership || membership.role !== 'admin') {
      return c.json({ error: { message: 'Only admins can regenerate invite code' } }, 403);
    }

    const crypto = require('crypto');
    const newCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    await group.update({ inviteCode: newCode });

    return c.json({
      message: 'Invite code regenerated successfully',
      inviteCode: newCode
    });
  } catch (error) {
    throw error;
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
