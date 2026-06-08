const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number },
  badge: { type: String, default: '' },
  icon: { type: String },
  bg: { type: String },
  desc: { type: String },
  fullDesc: { type: String },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 0 },
  tags: [String],
  skin: { type: String, default: 'All skin types' },
  size: { type: String }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
