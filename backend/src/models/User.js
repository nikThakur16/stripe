import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['inactive', 'active', 'past_due', 'canceled'], default: 'inactive' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodEnd: { type: Date },
    planId: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    subscription: { type: subscriptionSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema); 