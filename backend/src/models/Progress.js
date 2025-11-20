import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    weekNumber: {
      type: Number,
      default: 1
    },
    pointsEarned: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
progressSchema.index({ student: 1, course: 1 });
progressSchema.index({ student: 1, lesson: 1 });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
