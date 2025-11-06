const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' },
    platform: { type: String, enum: ['twitter', 'instagram', 'youtube'], required: true },
    postId: { type: String, required: true, unique: true },
    text: { type: String },
    createdAt: { type: Date },
    metrics: {
      likes: { type: Number, default: 0 },
      retweets: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
    },
    predictedVirality: { type: Number, default: 0 }, // model output later
  }, { timestamps: true });
  
  const SocialPost = mongoose.model('SocialPost', postSchema);
  module.exports = SocialPost;