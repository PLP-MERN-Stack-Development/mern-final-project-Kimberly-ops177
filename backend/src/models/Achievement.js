import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: [
        'course_completed',
        'module_completed',
        'first_lesson',
        'week_streak',
        'quiz_perfect',
        'early_bird',
        'night_owl',
        'community_contributor',
        'helper',
        'challenge_winner'
      ],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    points: {
      type: Number,
      default: 0
    },
    badge: {
      type: String // Icon or image URL
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for querying user achievements
achievementSchema.index({ student: 1, earnedAt: -1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
