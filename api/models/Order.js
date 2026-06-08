const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customer: { type: String, required: true },
  email: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  payment: { type: String, required: true },
  status: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    this.orderId = 'MG' + Date.now();
  }
  next();
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
