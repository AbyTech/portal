const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, required: true },  // deposit, withdrawal, admin_adjustment
  amount: { type: Number, required: true },
  address: { type: String },
  createdByAdmin: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);