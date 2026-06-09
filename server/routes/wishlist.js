const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  res.json({ wishlist: req.user.wishlist || [] });
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, name, price, icon, bg } = req.body;
    const exists = req.user.wishlist.find(w => w.productId === productId);
    if (exists) {
      return res.json({ wishlist: req.user.wishlist });
    }
    req.user.wishlist.push({ productId, name, price, icon, bg });
    await req.user.save();
    res.json({ wishlist: req.user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:productId', auth, async (req, res) => {
  try {
    req.user.wishlist = req.user.wishlist.filter(
      w => w.productId !== parseInt(req.params.productId)
    );
    await req.user.save();
    res.json({ wishlist: req.user.wishlist });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
