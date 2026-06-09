require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { requireDB } = require('./middleware/dbCheck');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'macandglow_website')));

// Connect to MongoDB (skipped if MONGODB_URI is not set)
if (process.env.MONGODB_URI) {
  connectDB();
}

// Routes that need DB
app.use('/api/auth', requireDB, require('./routes/auth'));
app.use('/api/orders', requireDB, require('./routes/orders'));
app.use('/api/contact', requireDB, require('./routes/contact'));
app.use('/api/wishlist', requireDB, require('./routes/wishlist'));

// Routes without DB requirement
app.use('/api/products', require('./routes/products'));

// Admin login (bypasses requireDB so login works even during DB issues)
app.post('/api/admin/login', require('./routes/admin').loginHandler);

// All other admin routes (require DB + admin auth)
app.use('/api/admin', requireDB, require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For local dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
