const { Hono } = require('hono');
const { authenticate } = require('../middleware/auth.middleware');
const groupController = require('../controllers/group.controller');

const router = new Hono();

// All routes require authentication
router.use('*', authenticate);

// Get all groups for current user
router.get('/', groupController.getGroups);

// Create new group
router.post('/', groupController.createGroup);

// Join group via invite code
router.post('/join', groupController.joinGroup);

// Get single group
router.get('/:id', groupController.getGroup);

// Update group
router.put('/:id', groupController.updateGroup);

// Delete group
router.delete('/:id', groupController.deleteGroup);

// Regenerate invite code
router.post('/:id/invite-code', groupController.regenerateInviteCode);

// Get group members
router.get('/:id/members', groupController.getMembers);

// Remove member from group
router.delete('/:id/members/:userId', groupController.removeMember);

// Update member role
router.put('/:id/members/:userId', groupController.updateMemberRole);

module.exports = router;
