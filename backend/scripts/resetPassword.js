import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const email = 'kimberlywanjiku28@gmail.com';
    const newPassword = 'password123';

    const user = await User.findOne({ email });

    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    console.log(`✅ Password reset successfully for ${user.name}`);
    console.log(`   Email: ${email}`);
    console.log(`   New Password: ${newPassword}\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();
