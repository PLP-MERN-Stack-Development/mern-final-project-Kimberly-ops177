import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';

dotenv.config();

const checkUpcomingCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    // Find Machine Learning and UI/UX Design courses
    const courses = await Course.find({
      $or: [
        { title: /Machine Learning/i },
        { title: /UI.*UX/i }
      ]
    }).select('title category startDate isPublished createdAt');

    console.log(`Found ${courses.length} courses:\n`);

    courses.forEach(course => {
      console.log(`Title: ${course.title}`);
      console.log(`Category: ${course.category}`);
      console.log(`Published: ${course.isPublished}`);
      console.log(`Start Date: ${course.startDate}`);
      console.log(`Start Date Type: ${typeof course.startDate}`);
      if (course.startDate) {
        console.log(`Start Date Value: ${course.startDate.toISOString()}`);
        console.log(`Is Future: ${new Date(course.startDate) > new Date()}`);
      }
      console.log(`Created At: ${course.createdAt}`);
      console.log('---\n');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUpcomingCourses();
