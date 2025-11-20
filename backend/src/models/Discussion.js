import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    category: {
      type: String,
      enum: ['question', 'discussion', 'announcement', 'help', 'resource'],
      default: 'discussion'
    },
    tags: [String],
    replies: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        content: {
          type: String,
          required: true,
          maxlength: 3000
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
        ],
        isInstructorResponse: {
          type: Boolean,
          default: false
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    views: {
      type: Number,
      default: 0
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isSolved: {
      type: Boolean,
      default: false
    },
    lastActivityAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
discussionSchema.index({ course: 1, lastActivityAt: -1 });
discussionSchema.index({ author: 1 });
discussionSchema.index({ tags: 1 });

// Update last activity when replies are added
discussionSchema.pre('save', function (next) {
  if (this.isModified('replies')) {
    this.lastActivityAt = Date.now();
  }
  next();
});

const Discussion = mongoose.model('Discussion', discussionSchema);

export default Discussion;
