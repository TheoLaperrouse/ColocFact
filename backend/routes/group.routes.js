const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const groupController = require('../controllers/group.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all groups for current user
router.get('/', groupController.getGroups);

// Create new group
router.post('/', [
  body('name').notEmpty().withMessage('Group name is required'),
  body('description').optional(),
  validate
], groupController.createGroup);

// Join group via invite code
router.post('/join', [
  body('inviteCode')
    .notEmpty()
    .withMessage('Invite code is required')
    .isLength({ min: 8, max: 8 })
    .withMessage('Invalid invite code format'),
  validate
], groupController.joinGroup);

// Get single group
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid group ID'),
  validate
], groupController.getGroup);

// Update group
router.put('/:id', [
  param('id').isUUID().withMessage('Invalid group ID'),
  body('name').optional().notEmpty().withMessage('Group name cannot be empty'),
  validate
], groupController.updateGroup);

// Delete group
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid group ID'),
  validate
], groupController.deleteGroup);

// Regenerate invite code
router.post('/:id/invite-code', [
  param('id').isUUID().withMessage('Invalid group ID'),
  validate
], groupController.regenerateInviteCode);

// Get group members
router.get('/:id/members', [
  param('id').isUUID().withMessage('Invalid group ID'),
  validate
], groupController.getMembers);

// Remove member from group
router.delete('/:id/members/:userId', [
  param('id').isUUID().withMessage('Invalid group ID'),
  param('userId').isUUID().withMessage('Invalid user ID'),
  validate
], groupController.removeMember);

// Update member role
router.put('/:id/members/:userId', [
  param('id').isUUID().withMessage('Invalid group ID'),
  param('userId').isUUID().withMessage('Invalid user ID'),
  body('role').isIn(['admin', 'member']).withMessage('Role must be admin or member'),
  validate
], groupController.updateMemberRole);

module.exports = router;
