import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

dotenv.config();

const testPasswordCompare = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const email = 'kimberlywanjiku28@gmail.com';
    const testPassword = 'password123';

    // Get user WITH password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.error('User not found!');
      process.exit(1);
    }

    console.log('User found:', user.name);
    console.log('Email:', user.email);
    console.log('Password hash:', user.password.substring(0, 20) + '...');
    console.log(`\nTesting password: "${testPassword}"`);

    // Test 1: Direct bcrypt compare
    console.log('\n--- Test 1: Direct bcrypt.compare() ---');
    const directMatch = await bcrypt.compare(testPassword, user.password);
    console.log('Result:', directMatch ? '✅ MATCH' : '❌ NO MATCH');

    // Test 2: Using user model method
    console.log('\n--- Test 2: user.comparePassword() method ---');
    const methodMatch = await user.comparePassword(testPassword);
    console.log('Result:', methodMatch ? '✅ MATCH' : '❌ NO MATCH');

    // Test 3: Try wrong password
    console.log('\n--- Test 3: Wrong password ---');
    const wrongMatch = await user.comparePassword('wrongpassword');
    console.log('Result:', wrongMatch ? '✅ MATCH (ERROR!)' : '❌ NO MATCH (CORRECT)');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPasswordCompare();
