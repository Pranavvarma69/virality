const Campaign = require('../models/Campaign');

// Create a new campaign
const createCampaign = async (req, res) => {
  try {
    console.log('🟢 Request User:', req.user); // debug log

    if (!req.user) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    // Automatically set brandId from logged-in user
    const campaign = new Campaign({
      brandId: req.user._id,
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      budget: req.body.budget,
      goals: req.body.goals,
      status: req.body.status || 'draft'
    });

    const savedCampaign = await campaign.save();

    console.log('✅ Campaign Created:', savedCampaign);

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: savedCampaign
    });
  } catch (error) {
    console.error('❌ Error creating campaign:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('brandId', 'name email');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get campaign by ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('brandId', 'name email');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    Object.assign(campaign, req.body);
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
};