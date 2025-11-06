const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    brandId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Brand', 
      required: true 
    },

    name: { 
      type: String, 
      required: true 
    },

    description: { 
      type: String 
    },

    startDate: { 
      type: Date, 
      required: true 
    },

    endDate: { 
      type: Date, 
      required: true 
    },

    budget: { 
      type: Number, 
      required: true 
    },

    goals: { 
      type: String // e.g., "Increase brand awareness", "Drive traffic"
    },

    status: { 
      type: String, 
      enum: ['draft', 'active', 'completed', 'cancelled'], 
      default: 'draft' 
    },

    influencers: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' }
    ],

    performance: {
      reach: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;