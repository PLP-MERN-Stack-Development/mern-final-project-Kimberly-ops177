import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Course from '../src/models/Course.js';
import User from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const updateExistingCourses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Define self-paced pricing (typically 20-30% less than with-tutor price)
    const coursePricing = {
      'Complete Data Engineering Bootcamp': { price: 299, selfPaced: 229, months: 6 },
      'Professional Data Science Masterclass': { price: 349, selfPaced: 269, months: 8 },
      'Data Analysis with Excel, SQL & Python': { price: 199, selfPaced: 149, months: 4 },
      'Complete Software Testing & QA Bootcamp': { price: 249, selfPaced: 189, months: 5 },
      'Flutter & Dart - Complete Mobile App Development': { price: 279, selfPaced: 209, months: 6 }
    };

    console.log('Updating existing courses with new pricing and learning modes...\n');

    for (const [title, pricing] of Object.entries(coursePricing)) {
      const course = await Course.findOne({ title });
      if (course) {
        course.selfPacedPrice = pricing.selfPaced;
        course.learningModes = ['self-paced', 'with-tutor'];
        course.deliveryMode = 'online';

        // Update price to match with-tutor price
        course.price = pricing.price;

        await course.save();
        console.log(`✓ Updated: ${title}`);
        console.log(`  Duration: ${pricing.months} months`);
        console.log(`  With Tutor: $${pricing.price}`);
        console.log(`  Self-Paced: $${pricing.selfPaced}\n`);
      } else {
        console.log(`✗ Course not found: ${title}\n`);
      }
    }

    console.log('✅ All existing courses updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateExistingCourses();
