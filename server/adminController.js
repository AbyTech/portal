const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    // Find all users, but exclude their password and wallet phrase from the result
    const users = await User.find({}).select('-password -walletPhrase');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user balance
// @route   PUT /api/admin/users/:id/balance
// @access  Private/Admin
const updateUserBalance = async (req, res) => {
  const { btcBalance } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.btcBalance = btcBalance;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, updateUserBalance };