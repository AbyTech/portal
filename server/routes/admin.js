const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Get all users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await Transaction.find({ user_id: user._id })
      .sort({ timestamp: -1 });

    res.json({ user, transactions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user balance
router.put('/users/:id/balance', auth, admin, async (req, res) => {
  const { newBalance } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const oldBalance = user.btc_balance;
    user.btc_balance = newBalance;
    await user.save();

    await Transaction.create({
      user_id: user._id,
      type: 'admin_adjustment',
      amount: newBalance - oldBalance,
      address: 'Admin Adjustment',
      createdByAdmin: true
    });

    res.json({ message: 'Balance updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// All transactions
router.get('/transactions', auth, admin, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user_id', 'name email')
      .sort({ timestamp: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
