const { Hono } = require('hono');
const { authenticate } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = new Hono();

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user profile
router.get('/me', authenticate, authController.getProfile);

// Update profile
router.put('/me', authenticate, authController.updateProfile);

// Change password
router.put('/me/password', authenticate, authController.changePassword);

module.exports = router;
