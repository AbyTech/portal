require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Admin details - CHANGE THESE as needed
    const name = 'Admin';
    const email = 'admin@example.com';
    const password = 'AdminPassword123!';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists. No action taken.');
      process.exit(0);
    }

    // Create new admin
    const admin = new User({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      isAdmin: true,
      btcBalance: 0,
    });

    await admin.save();

    console.log(`✅ Admin created successfully!
Email: ${email}
Password: ${password}
`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

// Run the script
createAdmin();
