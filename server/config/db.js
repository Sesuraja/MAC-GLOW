const mongoose = require('mongoose');

let lastError = null;

const getLastError = () => lastError;

const connectDB = async () => {
  try {
    mongoose.connection.on('error', (err) => {
      lastError = err.message;
      console.error('MongoDB runtime error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    lastError = null;
  } catch (error) {
    lastError = error.message;
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Server will continue without database. Only static routes will work.');
  }
};

module.exports = connectDB;
module.exports.getLastError = getLastError;
