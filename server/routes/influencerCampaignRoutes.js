const express = require('express');
const router = express.Router();
const {
  inviteInfluencers,
  getCampaignInfluencers,
  respondToInvitation,
} = require('../controllers/influencerCampaignController');
const { protect, brandOnly, influencerOnly } = require('../middleware/authMiddleware');

router.post('/campaigns/:id/invite', protect,  inviteInfluencers);

router.get('/campaigns/:id/influencers', protect, getCampaignInfluencers);

router.put('/influencer-campaigns/:id', protect, respondToInvitation);

module.exports = router;