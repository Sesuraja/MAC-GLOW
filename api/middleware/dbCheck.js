const mongoose = require('mongoose');

const requireDB = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  res.status(503).json({
    error: 'Database not connected. Please set the MONGODB_URI environment variable.'
  });
};

module.exports = { requireDB };
