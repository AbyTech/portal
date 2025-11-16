const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.user.id }).sort({ timestamp: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw (create a sent transaction and update balance)
router.post('/withdraw', auth, async (req, res) => {
  const { amount, address } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.btc_balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Update user balance
    user.btc_balance -= amount;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      user_id: user._id,
      type: 'sent',
      amount,
      address,
    });
    await transaction.save();

    res.json({ message: 'Withdrawal successful', balance: user.btc_balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Deposit (create a received transaction and update balance)
router.post('/deposit', auth, async (req, res) => {
  const { amount, address } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Update user balance
    user.btc_balance += amount;
    await user.save();

    // Create transaction
    const transaction = new Transaction({
      user_id: user._id,
      type: 'received',
      amount,
      address,
    });
    await transaction.save();

    res.json({ message: 'Deposit successful', balance: user.btc_balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save wallet phrase
router.post('/save-wallet-phrase', auth, async (req, res) => {
  const { phrase } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletPhrase = phrase;
    await user.save();

    res.json({ message: 'Wallet phrase saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
