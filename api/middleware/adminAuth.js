const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'macandglow_jwt_secret_dev_2026';

const adminAuth = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fallback admin (used when MongoDB is not connected)
    if (decoded.userId === 'fallback_admin') {
      req.user = { _id: 'fallback_admin', name: 'Admin', email: process.env.ADMIN_EMAIL || 'admin@macandglow.com', role: 'admin' };
      req.token = token;
      return next();
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = { adminAuth };
