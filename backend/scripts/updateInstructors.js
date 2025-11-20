import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';

dotenv.config();

const updateInstructors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    // African instructor names to use
    const africanInstructors = [
      {
        email: 'amara.okonkwo@eduhub.com',
        name: 'Dr. Amara Okonkwo',
        password: 'instructor123'
      },
      {
        email: 'kwame.mensah@eduhub.com',
        name: 'Dr. Kwame Mensah',
        password: 'instructor123'
      },
      {
        email: 'zainab.hassan@eduhub.com',
        name: 'Dr. Zainab Hassan',
        password: 'instructor123'
      }
    ];

    // Create or update instructors
    for (const instructorData of africanInstructors) {
      let instructor = await User.findOne({ email: instructorData.email });

      if (instructor) {
        // Update existing instructor name
        instructor.name = instructorData.name;
        await instructor.save();
        console.log(`✓ Updated instructor: ${instructor.name}`);
      } else {
        // Create new instructor
        instructor = await User.create({
          ...instructorData,
          role: 'instructor'
        });
        console.log(`✓ Created instructor: ${instructor.name}`);
      }
    }

    // Delete any old instructors and reassign their courses
    const oldInstructors = await User.find({
      role: 'instructor',
      email: { $nin: africanInstructors.map(i => i.email) }
    });

    if (oldInstructors.length > 0) {
      console.log(`\nFound ${oldInstructors.length} old instructors. Removing and reassigning courses...`);
      const primaryInstructor = await User.findOne({ email: 'amara.okonkwo@eduhub.com' });

      for (const oldInstructor of oldInstructors) {
        // Reassign their courses to primary instructor
        await Course.updateMany(
          { instructor: oldInstructor._id },
          { instructor: primaryInstructor._id }
        );
        console.log(`✓ Reassigned courses from ${oldInstructor.name} to ${primaryInstructor.name}`);

        // Delete old instructor
        await User.deleteOne({ _id: oldInstructor._id });
        console.log(`✓ Deleted old instructor: ${oldInstructor.name}`);
      }
    }

    // Update all courses to use Dr. Amara Okonkwo as primary instructor
    const primaryInstructor = await User.findOne({ email: 'amara.okonkwo@eduhub.com' });
    if (primaryInstructor) {
      const coursesUpdated = await Course.updateMany(
        {},
        { instructor: primaryInstructor._id }
      );
      console.log(`\n✓ Updated ${coursesUpdated.modifiedCount} courses to use ${primaryInstructor.name} as instructor`);
    }

    console.log('\n✅ All instructors updated successfully!');

  } catch (error) {
    console.error('Error updating instructors:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

updateInstructors();
