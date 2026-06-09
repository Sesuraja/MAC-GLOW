require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../server/config/db');
const dbCheck = require('../server/middleware/dbCheck');
const { requireDB } = dbCheck;

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'macandglow_website')));

// Connect to MongoDB (skipped if MONGODB_URI is not set)
if (process.env.MONGODB_URI) {
  const promise = connectDB();
  dbCheck.setConnectionPromise(promise);
}

// Debug endpoint to check env vars (no DB required)
app.get('/api/debug-db', async (req, res) => {
  const uri = process.env.MONGODB_URI || '';
  let dnsResult = 'not checked';
  try {
    const dns = require('dns');
    dnsResult = await new Promise((resolve) => {
      dns.resolveSrv('_mongodb._tcp.cluster0.lxd6qba.mongodb.net', (err, records) => {
        if (err) resolve('SRV_FAIL: ' + err.code);
        else resolve('SRV_OK: ' + records.map(r => r.name).join(','));
      });
    });
  } catch (e) {
    dnsResult = 'DNS_ERROR: ' + e.message;
  }
  res.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    uriPrefix: uri ? uri.substring(0, 40) + '...' : 'not set',
    uriSuffix: uri ? '...' + uri.substring(uri.length - 30) : 'not set',
    dbState: ['disconnected', 'connected', 'connecting', 'disconnecting'][require('mongoose').connection.readyState] || 'unknown',
    lastError: connectDB.getLastError ? connectDB.getLastError() : null,
    dnsLookup: dnsResult,
    nodeEnv: process.env.NODE_ENV || 'not set',
    adminEmail: process.env.ADMIN_EMAIL || 'not set'
  });
});

// Routes that need DB
app.use('/api/auth', requireDB, require('../server/routes/auth'));
app.use('/api/orders', requireDB, require('../server/routes/orders'));
app.use('/api/contact', requireDB, require('../server/routes/contact'));
app.use('/api/wishlist', requireDB, require('../server/routes/wishlist'));

// Routes without DB requirement
app.use('/api/products', require('../server/routes/products'));

// Admin login (bypasses requireDB so login works even during DB issues)
app.post('/api/admin/login', require('../server/routes/admin').loginHandler);

// All other admin routes (require DB + admin auth)
app.use('/api/admin', requireDB, require('../server/routes/admin'));

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
