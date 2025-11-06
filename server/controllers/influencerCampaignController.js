const InfluencerCampaign = require('../models/influencercampaign');

// POST /api/campaigns/:id/invite
const inviteInfluencers = async (req, res) => {
  try {
    const { influencerIds, message } = req.body;
    const campaignId = req.params.id;

    if (!influencerIds || influencerIds.length === 0) {
      return res.status(400).json({ message: 'No influencers provided' });
    }

    const invites = await Promise.all(
      influencerIds.map(async (influencerId) => {
        return InfluencerCampaign.create({
          campaignId,
          influencerId,
          message,
          status: 'invited',
        });
      })
    );

    res.status(201).json({ message: 'Invitations sent', invites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/campaigns/:id/influencers
const getCampaignInfluencers = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const influencers = await InfluencerCampaign.find({ campaignId })
      .populate('influencerId', 'userId followerCount status')
      .populate({ path: 'influencerId', populate: { path: 'userId', select: 'name email' } });

    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/influencer-campaigns/:id  (accept/decline)
const respondToInvitation = async (req, res) => {
  try {
    const { status } = req.body; // expected: 'accepted' or 'declined'
    const validStatuses = ['accepted', 'declined'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const invite = await InfluencerCampaign.findById(req.params.id);
    if (!invite) return res.status(404).json({ message: 'Invitation not found' });

    invite.status = status;
    await invite.save();

    res.json({ message: `Invitation ${status}`, invite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  inviteInfluencers,
  getCampaignInfluencers,
  respondToInvitation,
};