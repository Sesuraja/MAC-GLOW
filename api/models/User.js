const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true, default: '' },
  password: { type: String, required: true },
  addresses: [{
    id: { type: String },
    name: { type: String },
    phone: { type: String },
    street: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' }
  }],
  wishlist: [{
    productId: { type: Number },
    name: { type: String },
    price: { type: Number },
    icon: { type: String },
    bg: { type: String }
  }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
