const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');

const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

const register = async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return c.json({ error: { message: 'Email already registered' } }, 400);
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    const token = generateToken(user.id);

    return c.json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    }, 201);
  } catch (error) {
    throw error;
  }
};

const login = async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return c.json({ error: { message: 'Invalid email or password' } }, 401);
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return c.json({ error: { message: 'Invalid email or password' } }, 401);
    }

    const token = generateToken(user.id);

    return c.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    throw error;
  }
};

const getProfile = async (c) => {
  try {
    const user = c.get('user');
    return c.json({ user: user.toJSON() });
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (c) => {
  try {
    const user = c.get('user');
    const { firstName, lastName, avatar } = await c.req.json();

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (avatar !== undefined) updates.avatar = avatar;

    await user.update(updates);

    return c.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    throw error;
  }
};

const changePassword = async (c) => {
  try {
    const user = c.get('user');
    const { currentPassword, newPassword } = await c.req.json();

    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return c.json({ error: { message: 'Current password is incorrect' } }, 400);
    }

    await user.update({ password: newPassword });

    return c.json({ message: 'Password changed successfully' });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
