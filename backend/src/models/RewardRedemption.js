import mongoose from 'mongoose';

const rewardRedemptionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
      required: true
    },
    pointsSpent: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending'
    },
    deliveryInfo: {
      address: String,
      phone: String,
      email: String,
      size: String, // For t-shirts, hoodies
      notes: String
    },
    redeemedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Index for querying user redemptions
rewardRedemptionSchema.index({ student: 1, redeemedAt: -1 });

const RewardRedemption = mongoose.model('RewardRedemption', rewardRedemptionSchema);

export default RewardRedemption;
