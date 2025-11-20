import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';

dotenv.config();

const listCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const courses = await Course.find().select('title category');

    console.log('Existing courses:');
    courses.forEach(c => console.log(`- ${c.title} (Category: ${c.category})`));
    console.log(`\nTotal: ${courses.length} courses`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

listCourses();
