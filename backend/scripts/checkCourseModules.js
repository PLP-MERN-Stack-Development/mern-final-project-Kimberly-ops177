import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';

dotenv.config();

const checkCourseModules = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const coursesToCheck = [
      'Data Engineering',
      'Data Science',
      'Data Analysis',
      'Software Testing',
      'Flutter'
    ];

    for (const courseName of coursesToCheck) {
      const course = await Course.findOne({ title: new RegExp(courseName, 'i') });
      if (!course) continue;

      console.log(`\n${course.title}`);
      console.log('='.repeat(60));

      const modules = await Module.find({ course: course._id }).sort({ order: 1 });

      if (modules.length === 0) {
        console.log('No modules found');
      } else {
        modules.forEach((mod, idx) => {
          console.log(`${idx + 1}. ${mod.title}`);
          if (mod.description) console.log(`   ${mod.description}`);
        });
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkCourseModules();
