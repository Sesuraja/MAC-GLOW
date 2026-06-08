const express = require('express');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { items, subtotal, shipping, total, payment, shippingAddress } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const order = new Order({
      userId: req.user._id,
      customer: req.user.name,
      email: req.user.email,
      items,
      subtotal,
      shipping,
      total,
      payment,
      shippingAddress
    });
    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/track/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id, userId: req.user._id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ error: `Order is already ${order.status}` });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
