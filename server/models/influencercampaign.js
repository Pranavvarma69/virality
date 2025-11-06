const mongoose = require('mongoose');

const influencerCampaignSchema = new mongoose.Schema(
  {
    influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    status: { type: String, enum: ['invited', 'accepted', 'declined'], default: 'invited' },
  },
  { timestamps: true }
);

const InfluencerCampaign = mongoose.model('InfluencerCampaign', influencerCampaignSchema);
module.exports = InfluencerCampaign;