import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';

dotenv.config();

const publishUpcomingCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    // Find Machine Learning and UI/UX Design courses
    const result = await Course.updateMany(
      {
        $or: [
          { title: /Machine Learning/i },
          { title: /UI.*UX/i }
        ]
      },
      { $set: { isPublished: true } }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses to published status`);

    // Show the courses
    const courses = await Course.find({
      $or: [
        { title: /Machine Learning/i },
        { title: /UI.*UX/i }
      ]
    }).select('title category isPublished startDate');

    console.log('\nCourses:');
    courses.forEach(course => {
      console.log(`- ${course.title}`);
      console.log(`  Category: ${course.category}`);
      console.log(`  Published: ${course.isPublished}`);
      if (course.startDate) {
        console.log(`  Start Date: ${course.startDate.toLocaleDateString()}`);
      }
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

publishUpcomingCourses();
