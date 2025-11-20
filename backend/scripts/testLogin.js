import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const email = 'kimberlywanjiku28@gmail.com';
    const testPassword = 'password123';

    const user = await User.findOne({ email });

    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }

    console.log(`Found user: ${user.name}`);
    console.log(`Email: ${user.email}`);

    if (!user.password) {
      console.log('\n⚠️  Password field is NULL/UNDEFINED!');
      console.log('Setting password for the first time...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      user.password = hashedPassword;
      await user.save();
      console.log('✅ Password has been set successfully!');
      console.log(`\nYou can now login with:`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${testPassword}`);
    } else {
      console.log(`Stored password hash: ${user.password.substring(0, 20)}...`);
      console.log(`\nTesting password: "${testPassword}"`);

      const isMatch = await bcrypt.compare(testPassword, user.password);

      if (isMatch) {
        console.log('\n✅ Password matches!');
      } else {
        console.log('\n❌ Password does NOT match!');

        // Let's rehash and save
        console.log('\nResetting password again...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testPassword, salt);
        user.password = hashedPassword;
        await user.save();
        console.log('✅ Password has been reset successfully!');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
