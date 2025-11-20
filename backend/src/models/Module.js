import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a module title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    order: {
      type: Number,
      required: true,
      default: 0
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for lesson count
moduleSchema.virtual('lessonCount').get(function () {
  return this.lessons ? this.lessons.length : 0;
});

// Index for querying modules by course
moduleSchema.index({ course: 1, order: 1 });

// Middleware to add module to course's modules array when saved
moduleSchema.post('save', async function () {
  const Course = mongoose.model('Course');
  await Course.findByIdAndUpdate(
    this.course,
    { $addToSet: { modules: this._id } }
  );
});

// Middleware to remove module from course when deleted
moduleSchema.pre('remove', async function (next) {
  const Course = mongoose.model('Course');
  await Course.findByIdAndUpdate(
    this.course,
    { $pull: { modules: this._id } }
  );
  next();
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
