import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const users = await User.find().select('name email role');

    console.log(`Found ${users.length} users:\n`);

    users.forEach(user => {
      console.log(`- ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
