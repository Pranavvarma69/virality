const mongoose = require('mongoose');

const socialAccountSchema = new mongoose.Schema(
  {
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
    platform: { type: String, required: true },
    authToken: { type: String, required: true }, // Secure storage recommended
  },
  { timestamps: true }
);

const SocialAccount = mongoose.model('SocialAccount', socialAccountSchema);
module.exports = SocialAccount;
