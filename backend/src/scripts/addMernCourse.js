import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

const addMernCourse = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    // Find an instructor user (you can modify this to use a specific instructor)
    let instructor = await User.findOne({ role: 'instructor' });

    if (!instructor) {
      console.log('No instructor found. Creating a default instructor...');
      instructor = await User.create({
        name: 'Dr. Amara Okonkwo',
        email: 'amara.okonkwo@eduhub.com',
        password: 'instructor123', // This will be hashed by the User model
        role: 'instructor'
      });
      console.log('Created instructor:', instructor.name);
    } else {
      console.log('Using existing instructor:', instructor.name);
    }

    // Check if MERN course already exists
    const existingCourse = await Course.findOne({
      title: { $regex: /MERN/i }
    });

    if (existingCourse) {
      console.log('MERN course already exists:', existingCourse.title);
      console.log('Course ID:', existingCourse._id);
      process.exit(0);
    }

    // Create MERN Stack course
    const mernCourse = await Course.create({
      title: 'Full Stack MERN Development',
      description: 'Master the MERN stack (MongoDB, Express, React, Node.js) and build modern full-stack web applications. Learn to create RESTful APIs, work with databases, implement authentication, and deploy production-ready applications.',
      instructor: instructor._id,
      category: 'Web Development',
      level: 'intermediate',
      price: 0,
      selfPacedPrice: 0,
      learningModes: ['self-paced', 'with-tutor'],
      deliveryMode: 'online',
      isPublished: true,
      duration: 2400, // 40 hours in minutes
      language: 'English',
      requirements: [
        'Basic understanding of JavaScript',
        'Familiarity with HTML and CSS',
        'Understanding of programming fundamentals',
        'A computer with internet connection'
      ],
      whatYouWillLearn: [
        'Build full-stack web applications using MERN stack',
        'Create RESTful APIs with Node.js and Express',
        'Work with MongoDB and Mongoose for database operations',
        'Build dynamic user interfaces with React',
        'Implement user authentication and authorization',
        'Deploy applications to production environments',
        'Follow best practices for web development',
        'Use Git for version control and collaboration'
      ],
      tags: [
        'MERN',
        'MongoDB',
        'Express',
        'React',
        'Node.js',
        'Full Stack',
        'JavaScript',
        'Web Development',
        'API Development',
        'Database'
      ],
      weeklySchedule: [
        {
          weekNumber: 1,
          weekRange: 'Week 1-2',
          title: 'Introduction to MERN & Node.js Fundamentals',
          topics: [
            'MERN stack overview',
            'Node.js setup and basics',
            'NPM and package management',
            'Asynchronous JavaScript'
          ],
          learningObjectives: [
            'Understand the MERN stack architecture',
            'Set up Node.js development environment',
            'Work with npm packages',
            'Handle asynchronous operations'
          ]
        },
        {
          weekNumber: 3,
          weekRange: 'Week 3-4',
          title: 'Express.js & RESTful APIs',
          topics: [
            'Express.js framework',
            'Routing and middleware',
            'REST API design',
            'Error handling'
          ],
          learningObjectives: [
            'Build Express.js applications',
            'Create RESTful APIs',
            'Implement middleware',
            'Handle errors gracefully'
          ]
        },
        {
          weekNumber: 5,
          weekRange: 'Week 5-6',
          title: 'MongoDB & Mongoose',
          topics: [
            'MongoDB basics',
            'Mongoose ODM',
            'Schema design',
            'CRUD operations'
          ],
          learningObjectives: [
            'Work with MongoDB databases',
            'Design database schemas',
            'Perform database operations',
            'Use Mongoose for data modeling'
          ]
        },
        {
          weekNumber: 7,
          weekRange: 'Week 7-8',
          title: 'React Fundamentals',
          topics: [
            'React components',
            'State and props',
            'React hooks',
            'Component lifecycle'
          ],
          learningObjectives: [
            'Build React components',
            'Manage application state',
            'Use React hooks effectively',
            'Handle component lifecycle'
          ]
        },
        {
          weekNumber: 9,
          weekRange: 'Week 9-10',
          title: 'Advanced React & State Management',
          topics: [
            'Context API',
            'Redux/state management',
            'React Router',
            'Form handling'
          ],
          learningObjectives: [
            'Implement advanced state management',
            'Create multi-page applications',
            'Handle complex forms',
            'Optimize React applications'
          ]
        },
        {
          weekNumber: 11,
          weekRange: 'Week 11-12',
          title: 'Authentication & Security',
          topics: [
            'JWT authentication',
            'User registration and login',
            'Password hashing',
            'Protected routes'
          ],
          learningObjectives: [
            'Implement user authentication',
            'Secure API endpoints',
            'Manage user sessions',
            'Protect sensitive data'
          ]
        },
        {
          weekNumber: 13,
          weekRange: 'Week 13-14',
          title: 'Full Stack Integration',
          topics: [
            'Connecting frontend and backend',
            'API integration',
            'File uploads',
            'Real-time features'
          ],
          learningObjectives: [
            'Integrate React with Express API',
            'Handle file uploads',
            'Implement real-time features',
            'Debug full-stack applications'
          ]
        },
        {
          weekNumber: 15,
          weekRange: 'Week 15-16',
          title: 'Deployment & Best Practices',
          topics: [
            'Production deployment',
            'Environment variables',
            'Performance optimization',
            'Testing and debugging'
          ],
          learningObjectives: [
            'Deploy MERN applications',
            'Optimize application performance',
            'Follow development best practices',
            'Test and debug effectively'
          ]
        }
      ]
    });

    console.log('\n✅ MERN Course created successfully!');
    console.log('Course Title:', mernCourse.title);
    console.log('Course ID:', mernCourse._id);
    console.log('Category:', mernCourse.category);
    console.log('Level:', mernCourse.level);
    console.log('Instructor:', instructor.name);

  } catch (error) {
    console.error('Error adding MERN course:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

addMernCourse();
