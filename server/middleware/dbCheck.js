const mongoose = require('mongoose');
const connectDB = require('../config/db');

const dbCheck = {
  requireDB: async (req, res, next) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        await connectDB();
      }

      if (mongoose.connection.readyState === 1) {
        return next();
      }

      return res.status(503).json({
        error: 'Database connection unavailable'
      });

    } catch (err) {
      return res.status(503).json({
        error: 'Database connection failed',
        details: err.message
      });
    }
  }
};

module.exports = dbCheck;
