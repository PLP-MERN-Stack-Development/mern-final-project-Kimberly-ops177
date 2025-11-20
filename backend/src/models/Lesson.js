import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    content: {
      type: String
    },
    // Lesson type
    type: {
      type: String,
      enum: ['live', 'recorded', 'reading', 'assignment', 'quiz', 'project'],
      default: 'recorded'
    },
    // For live sessions
    scheduledDateTime: {
      type: Date
    },
    endDateTime: {
      type: Date
    },
    // Meeting details for live sessions
    meetingLink: {
      type: String
    },
    meetingId: {
      type: String
    },
    meetingPassword: {
      type: String
    },
    videoUrl: {
      type: String,
      default: ''
    },
    duration: {
      type: Number, // in minutes
      default: 60
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String // pdf, doc, image, etc.
      }
    ],
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['pdf', 'video', 'link', 'document', 'code', 'other']
        }
      }
    ],
    // Status
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'completed', 'cancelled'],
      default: 'published'
    },
    // Attendance tracking (for live sessions)
    attendees: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        joinedAt: Date,
        leftAt: Date,
        attended: {
          type: Boolean,
          default: false
        }
      }
    ],
    // Recording details
    recordingUrl: {
      type: String
    },
    recordingAvailable: {
      type: Boolean,
      default: false
    },
    // Points and completion
    pointsReward: {
      type: Number,
      default: 50
    },
    objectives: [String], // Learning objectives
    isFree: {
      type: Boolean,
      default: false // Free lessons can be previewed without enrollment
    }
  },
  {
    timestamps: true
  }
);

// Indexes for querying lessons
lessonSchema.index({ module: 1, order: 1 });
lessonSchema.index({ course: 1, scheduledDateTime: 1 });
lessonSchema.index({ instructor: 1, scheduledDateTime: 1 });
lessonSchema.index({ scheduledDateTime: 1, status: 1 });

// Virtual for checking if lesson is upcoming
lessonSchema.virtual('isUpcoming').get(function () {
  return this.scheduledDateTime && this.scheduledDateTime > new Date();
});

// Virtual for checking if lesson is in progress
lessonSchema.virtual('isInProgress').get(function () {
  if (!this.scheduledDateTime || !this.endDateTime) return false;
  const now = new Date();
  return now >= this.scheduledDateTime && now <= this.endDateTime;
});

// Method to mark student attendance
lessonSchema.methods.markAttendance = async function (studentId, attended = true) {
  const attendee = this.attendees.find(
    a => a.student.toString() === studentId.toString()
  );

  if (attendee) {
    attendee.attended = attended;
    if (attended && !attendee.joinedAt) {
      attendee.joinedAt = new Date();
    }
  } else {
    this.attendees.push({
      student: studentId,
      attended,
      joinedAt: attended ? new Date() : undefined
    });
  }

  return this.save();
};

// Static method to get upcoming lessons for enrolled courses
lessonSchema.statics.getUpcomingLessons = function (courseIds, limit = 10) {
  return this.find({
    course: { $in: courseIds },
    scheduledDateTime: { $gte: new Date() },
    status: { $in: ['published', 'scheduled'] }
  })
    .populate('course', 'title category')
    .populate('module', 'title')
    .populate('instructor', 'name email')
    .sort({ scheduledDateTime: 1 })
    .limit(limit);
};

// Static method to get lessons by date range
lessonSchema.statics.getLessonsByDateRange = function (startDate, endDate, courseIds) {
  return this.find({
    course: { $in: courseIds },
    scheduledDateTime: {
      $gte: startDate,
      $lte: endDate
    },
    status: { $in: ['published', 'scheduled'] }
  })
    .populate('course', 'title category')
    .populate('module', 'title')
    .populate('instructor', 'name')
    .sort({ scheduledDateTime: 1 });
};

// Middleware to add lesson to module's lessons array when saved
lessonSchema.post('save', async function () {
  const Module = mongoose.model('Module');
  await Module.findByIdAndUpdate(
    this.module,
    { $addToSet: { lessons: this._id } }
  );
});

// Middleware to remove lesson from module when deleted
lessonSchema.pre('remove', async function (next) {
  const Module = mongoose.model('Module');
  await Module.findByIdAndUpdate(
    this.module,
    { $pull: { lessons: this._id } }
  );
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
