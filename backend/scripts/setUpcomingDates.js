import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';

dotenv.config();

const setUpcomingDates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const upcomingDate = new Date('2025-12-13');
    console.log('Setting start date to:', upcomingDate.toISOString());
    console.log('');

    // Update Machine Learning and UI/UX Design courses
    const result = await Course.updateMany(
      {
        $or: [
          { title: /Machine Learning/i },
          { title: /UI.*UX/i }
        ]
      },
      {
        $set: {
          startDate: upcomingDate,
          isPublished: true
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} courses with start date\n`);

    // Verify the changes
    const courses = await Course.find({
      $or: [
        { title: /Machine Learning/i },
        { title: /UI.*UX/i }
      ]
    }).select('title category startDate isPublished');

    console.log('Updated courses:');
    courses.forEach(course => {
      console.log(`- ${course.title}`);
      console.log(`  Category: ${course.category}`);
      console.log(`  Published: ${course.isPublished}`);
      console.log(`  Start Date: ${course.startDate}`);
      if (course.startDate) {
        console.log(`  Is Future: ${new Date(course.startDate) > new Date()}`);
      }
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

setUpcomingDates();
