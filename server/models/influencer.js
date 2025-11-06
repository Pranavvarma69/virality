const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    socialHandles: {
      twitter: { type: String },
      instagram: { type: String },
      youtube: { type: String },
    },
    followerCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['prospect', 'active', 'inactive', 'brand ambassador'],
      default: 'prospect',
    },
  },
  { timestamps: true }
);

const Influencer = mongoose.model('Influencer', influencerSchema);
module.exports = Influencer;