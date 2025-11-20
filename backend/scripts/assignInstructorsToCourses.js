import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';

dotenv.config();

const assignInstructorsToCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    // Get all three instructors
    const amara = await User.findOne({ email: 'amara.okonkwo@eduhub.com' });
    const kwame = await User.findOne({ email: 'kwame.mensah@eduhub.com' });
    const zainab = await User.findOne({ email: 'zainab.hassan@eduhub.com' });

    if (!amara || !kwame || !zainab) {
      console.error('Not all instructors found!');
      process.exit(1);
    }

    console.log('\nInstructors found:');
    console.log(`- ${amara.name}`);
    console.log(`- ${kwame.name}`);
    console.log(`- ${zainab.name}`);

    // Define course-to-instructor mapping based on their specialties
    const courseAssignments = [
      // Dr. Amara Okonkwo - MERN, Web Development, Mobile Development
      { pattern: /MERN/i, instructor: amara },
      { pattern: /Full Stack/i, instructor: amara },
      { pattern: /Web Development/i, instructor: amara },
      { pattern: /Flutter/i, instructor: amara },
      { pattern: /Mobile/i, instructor: amara },

      // Dr. Kwame Mensah - DevOps, Cloud, Infrastructure
      { pattern: /DevOps/i, instructor: kwame },
      { pattern: /Cloud/i, instructor: kwame },
      { pattern: /Infrastructure/i, instructor: kwame },

      // Dr. Zainab Hassan - Data Science, Cybersecurity, Software Testing
      { pattern: /Cybersecurity/i, instructor: zainab },
      { pattern: /Data Science/i, instructor: zainab },
      { pattern: /Data Analysis/i, instructor: zainab },
      { pattern: /Data Engineering/i, instructor: zainab },
      { pattern: /Software Testing/i, instructor: zainab },
      { pattern: /QA/i, instructor: zainab },
    ];

    // Get all courses
    const courses = await Course.find();
    console.log(`\nFound ${courses.length} courses to assign\n`);

    // Assign instructors to courses
    for (const course of courses) {
      let assigned = false;

      // Try to match course title with patterns
      for (const assignment of courseAssignments) {
        if (assignment.pattern.test(course.title)) {
          course.instructor = assignment.instructor._id;
          await course.save();
          console.log(`✓ Assigned "${course.title}" to ${assignment.instructor.name}`);
          assigned = true;
          break;
        }
      }

      // If no pattern matched, assign to Dr. Amara Okonkwo as default
      if (!assigned) {
        course.instructor = amara._id;
        await course.save();
        console.log(`✓ Assigned "${course.title}" to ${amara.name} (default)`);
      }
    }

    // Show summary
    console.log('\n📊 Assignment Summary:');
    const amaraCourses = await Course.countDocuments({ instructor: amara._id });
    const kwameCourses = await Course.countDocuments({ instructor: kwame._id });
    const zainabCourses = await Course.countDocuments({ instructor: zainab._id });

    console.log(`${amara.name}: ${amaraCourses} courses`);
    console.log(`${kwame.name}: ${kwameCourses} courses`);
    console.log(`${zainab.name}: ${zainabCourses} courses`);

    console.log('\n✅ All courses assigned successfully!');

  } catch (error) {
    console.error('Error assigning instructors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

assignInstructorsToCourses();
