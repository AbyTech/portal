const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  btc_balance: { type: Number, default: 0.0 },
  isAdmin: { type: Boolean, default: false },
  walletPhrase: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);