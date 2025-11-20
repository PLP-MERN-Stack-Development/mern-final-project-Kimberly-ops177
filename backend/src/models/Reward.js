import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['bitcoin', 'uber_trip', 't-shirt', 'hoodie', 'cap', 'course_discount', 'certificate'],
      required: true
    },
    pointsCost: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String
    },
    stock: {
      type: Number,
      default: -1 // -1 means unlimited
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Reward = mongoose.model('Reward', rewardSchema);

export default Reward;
