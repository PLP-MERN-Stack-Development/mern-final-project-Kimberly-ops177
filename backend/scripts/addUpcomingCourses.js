import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../src/models/Course.js';
import User from '../src/models/User.js';

dotenv.config();

const addUpcomingCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB Connected');

    // Find an instructor
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.error('Instructor not found!');
      process.exit(1);
    }

    console.log(`Using instructor: ${instructor.name}\n`);

    const upcomingDate = new Date('2025-12-13');

    // Check if courses already exist
    const existingML = await Course.findOne({ title: /Machine Learning/i });
    const existingUIUX = await Course.findOne({ title: /UI.*UX/i });

    const coursesToCreate = [];

    if (!existingML) {
      coursesToCreate.push({
        title: 'Machine Learning Fundamentals',
        description: 'Master machine learning from the ground up. Learn supervised and unsupervised learning, neural networks, deep learning with TensorFlow and PyTorch. Build and deploy real-world ML models for classification, regression, and prediction tasks.',
        category: 'Machine Learning',
        level: 'intermediate',
        instructor: instructor._id,
        duration: 10,
        startDate: upcomingDate,
        image: '/images/Machine Learning.jpeg',
        price: 0,
        tags: ['Machine Learning', 'AI', 'Python', 'TensorFlow', 'PyTorch', 'Neural Networks'],
        requirements: [
          'Basic Python programming knowledge',
          'Understanding of mathematics (algebra, calculus)',
          'Familiarity with statistics',
          'Computer with Python installed'
        ],
        whatYouWillLearn: [
          'Understand core machine learning concepts and algorithms',
          'Build supervised and unsupervised learning models',
          'Implement neural networks and deep learning',
          'Use TensorFlow and PyTorch for model development',
          'Deploy ML models to production',
          'Work with real-world datasets and solve practical problems'
        ]
      });
    }

    if (!existingUIUX) {
      coursesToCreate.push({
        title: 'UI/UX Design Masterclass',
        description: 'Become a professional UI/UX designer. Learn user research, wireframing, prototyping, and visual design. Master Figma and Adobe XD to create stunning, user-centered interfaces. Build a portfolio of real-world projects.',
        category: 'UI/UX Design',
        level: 'beginner',
        instructor: instructor._id,
        duration: 8,
        startDate: upcomingDate,
        image: '/images/UI-UX Design.jpeg',
        price: 0,
        tags: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        requirements: [
          'No prior design experience needed',
          'Computer with internet access',
          'Willingness to learn design principles',
          'Creative mindset'
        ],
        whatYouWillLearn: [
          'Master UI/UX design principles and best practices',
          'Conduct user research and create user personas',
          'Create wireframes and interactive prototypes',
          'Design beautiful interfaces with Figma and Adobe XD',
          'Understand color theory, typography, and visual hierarchy',
          'Build a professional design portfolio'
        ]
      });
    }

    if (coursesToCreate.length === 0) {
      console.log('Both Machine Learning and UI/UX Design courses already exist!');
      process.exit(0);
    }

    // Create the courses
    const createdCourses = await Course.insertMany(coursesToCreate);

    console.log('✅ Successfully added upcoming courses!\n');
    createdCourses.forEach(course => {
      console.log(`- ${course.title} (${course.category})`);
      console.log(`  Start Date: December 13, 2025`);
      console.log(`  Level: ${course.level}`);
      console.log(`  Duration: ${course.duration} weeks\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addUpcomingCourses();
