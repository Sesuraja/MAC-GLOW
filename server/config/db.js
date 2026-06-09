const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB runtime error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Server will continue without database. Only static routes will work.');
  }
};

module.exports = connectDB;
