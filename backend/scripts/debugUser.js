import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const debugUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const email = process.env.FIX_EMAIL;

    // Get user WITH password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }

    console.log('User found:');
    console.log('ID:', user._id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password field type:', typeof user.password);
    console.log('Password value:', user.password);
    console.log('Password length:', user.password ? user.password.length : 0);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugUser();
