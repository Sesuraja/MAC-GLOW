const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

// Dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, totalContacts, totalNewsletter, revenueResult] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Contact.countDocuments(),
      Newsletter.countDocuments(),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalContacts,
        totalNewsletter,
        totalRevenue: revenueResult.length > 0 ? revenueResult[0].total : 0
      },
      recentOrders,
      recentContacts
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders management
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Order.countDocuments(query);
    res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = status;
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Products management
router.get('/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    const productCount = await Product.countDocuments();
    // If no products in DB, return empty array
    res.json({ products, total: productCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/products', adminAuth, async (req, res) => {
  try {
    const { name, category, price, mrp, badge, icon, bg, desc, fullDesc, rating, reviews, tags, skin, size } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Name, category, and price are required' });
    }
    // Auto-generate id
    const maxProduct = await Product.findOne().sort({ id: -1 });
    const newId = maxProduct ? maxProduct.id + 1 : 31;
    const product = new Product({ id: newId, name, category, price, mrp, badge, icon, bg, desc, fullDesc, rating, reviews, tags, skin, size });
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const allowed = ['name', 'category', 'price', 'mrp', 'badge', 'icon', 'bg', 'desc', 'fullDesc', 'rating', 'reviews', 'tags', 'skin', 'size'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) product[key] = req.body[key];
    });
    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Contact messages
router.get('/contacts', adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/contacts/:id/read', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    contact.isRead = true;
    await contact.save();
    res.json({ contact });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/contacts/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Newsletter subscribers
router.get('/newsletter', adminAuth, async (req, res) => {
  try {
    const subs = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ subscribers: subs });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Users management
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin login handler (exported separately so it can bypass requireDB)
async function loginHandler(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const mongoose = require('mongoose');
  // If DB is connected, authenticate against MongoDB
  if (mongoose.connection.readyState === 1) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const { generateToken } = require('../middleware/auth');
      const token = generateToken(user._id);
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      console.error('Admin login DB error:', err.message);
      return res.status(500).json({ error: 'Server error. Check database connection.' });
    }
  }
  // Fallback: when MongoDB is not connected, check .env credentials
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@macandglow.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
    const { generateToken } = require('../middleware/auth');
    const token = generateToken('fallback_admin');
    return res.json({
      token,
      user: { id: 'fallback_admin', name: 'Admin', email: adminEmail, role: 'admin' }
    });
  }
  res.status(401).json({ error: 'Invalid credentials' });
}

// Mount login on router too (for consistency, but main mount bypasses requireDB)
router.post('/login', loginHandler);

module.exports = router;
module.exports.loginHandler = loginHandler;
