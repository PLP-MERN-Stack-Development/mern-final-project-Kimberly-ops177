import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const fixPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const email = process.env.FIX_EMAIL;
    const newPassword = process.env.FIX_NEW_PASSWORD;


    const user = await User.findOne({ email });

    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }

    console.log('Found user:', user.name);
    console.log('Email:', user.email);
    console.log('\nSetting password to:', newPassword);

    // Set the plain text password - the pre-save hook will hash it
    user.password = newPassword;

    // Save the user - this will trigger the pre-save hook
    await user.save();

    console.log('✅ Password has been set successfully!');
    console.log('\nYou can now login with:');
    console.log('Email:', email);
    console.log('Password:', newPassword);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixPassword();
