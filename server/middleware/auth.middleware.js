const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const { User } = require('../models');

const authenticate = async (c, next) => {
  try {
    const authHeader = c.req.header('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: { message: 'Authentication required' } }, 401);
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return c.json({ error: { message: 'User not found' } }, 401);
    }

    c.set('user', user);
    c.set('userId', user.id);
    await next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return c.json({ error: { message: 'Invalid token' } }, 401);
    }
    if (error.name === 'TokenExpiredError') {
      return c.json({ error: { message: 'Token expired' } }, 401);
    }
    throw error;
  }
};

const optionalAuth = async (c, next) => {
  try {
    const authHeader = c.req.header('authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findByPk(decoded.userId);

      if (user) {
        c.set('user', user);
        c.set('userId', user.id);
      }
    }
    await next();
  } catch (error) {
    await next();
  }
};

module.exports = { authenticate, optionalAuth };
