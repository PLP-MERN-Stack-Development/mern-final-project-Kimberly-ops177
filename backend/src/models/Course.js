import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    thumbnail: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science',
        'Machine Learning',
        'Cybersecurity',
        'DevOps',
        'UI/UX Design',
        'Software Testing',
        'Other'
      ]
    },
    level: {
      type: String,
      required: [true, 'Please provide a difficulty level'],
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    selfPacedPrice: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    learningModes: {
      type: [String],
      enum: ['self-paced', 'with-tutor'],
      default: ['self-paced', 'with-tutor']
    },
    deliveryMode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'online'
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
      }
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number, // in minutes
      default: 0
    },
    language: {
      type: String,
      default: 'English'
    },
    requirements: [String],
    whatYouWillLearn: [String],
    tags: [String],
    pathway: {
      name: String,              // e.g., "Data Engineering Pathway"
      stage: Number,             // 1, 2, 3, 4
      stageTitle: String,        // e.g., "Professional Foundations"
      totalStages: Number,       // Total stages in pathway
      estimatedWeeks: Number     // Duration in weeks
    },
    prerequisites: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course'
        },
        minimumScore: {
          type: Number,
          default: 70 // Minimum percentage required
        }
      }
    ],
    isLocked: {
      type: Boolean,
      default: false
    },
    unlockDate: Date,
    startDate: Date, // Course start date for upcoming courses
    weeklySchedule: [
      {
        weekNumber: Number,        // 1-16
        weekRange: String,         // "Week 1-2"
        title: String,             // "Introduction to Data Analytics"
        topics: [String],          // ["Data types", "Excel basics"]
        learningObjectives: [String]
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for enrolled student count
courseSchema.virtual('enrollmentCount').get(function () {
  return this.enrolledStudents ? this.enrolledStudents.length : 0;
});

// Index for search optimization
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ instructor: 1 });

// Middleware to update instructor's createdCourses when a course is saved
courseSchema.post('save', async function () {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(
    this.instructor,
    { $addToSet: { createdCourses: this._id } }
  );
});

// Middleware to remove course from instructor's createdCourses when deleted
courseSchema.pre('remove', async function (next) {
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(
    this.instructor,
    { $pull: { createdCourses: this._id } }
  );
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
