import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Lesson from '../src/models/Lesson.js';

dotenv.config();

const auditCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected\n');

    const courses = await Course.find().select('title category');

    console.log('Course Content Audit');
    console.log('='.repeat(80));

    for (const course of courses) {
      const moduleCount = await Module.countDocuments({ course: course._id });
      const lessonCount = await Lesson.countDocuments({ course: course._id });

      const totalDuration = await Lesson.aggregate([
        { $match: { course: course._id } },
        { $group: { _id: null, total: { $sum: '$duration' } } }
      ]);

      const duration = totalDuration.length > 0 ? totalDuration[0].total : 0;
      const hours = (duration / 60).toFixed(1);

      const status = moduleCount > 0 && lessonCount > 0 ? '✅' : '❌';

      console.log(`\n${status} ${course.title}`);
      console.log(`   Category: ${course.category}`);
      console.log(`   Modules: ${moduleCount}`);
      console.log(`   Lessons: ${lessonCount}`);
      console.log(`   Duration: ${duration} min (${hours} hrs)`);
    }

    console.log('\n' + '='.repeat(80));
    const coursesWithContent = await Course.countDocuments({
      _id: { $in: await Module.distinct('course') }
    });
    console.log(`\nSummary: ${coursesWithContent}/${courses.length} courses have content\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

auditCourses();
