const mongoose = require('mongoose');

let connectionPromise = null;
const dbCheck = {
  setConnectionPromise: (promise) => { connectionPromise = promise; },
  requireDB: async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
      return next();
    }
    if (mongoose.connection.readyState === 2 && connectionPromise) {
      try {
        await connectionPromise;
        if (mongoose.connection.readyState === 1) return next();
      } catch (e) {}
    }
    res.status(503).json({
      error: 'Database not connected. Please set the MONGODB_URI environment variable.'
    });
  }
};

module.exports = dbCheck;
