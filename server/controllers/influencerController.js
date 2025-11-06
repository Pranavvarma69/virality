const Influencer = require('../models/influencer');

// Create influencer
const createInfluencer = async (req, res) => {
  try {
    const { socialHandles, followerCount, status } = req.body;

    const influencer = await Influencer.create({
      userId: req.user._id, // added by protect middleware
      socialHandles,
      followerCount,
      status,
    });

    res.status(201).json(influencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all influencers
const getInfluencers = async (req, res) => {
  try {
    const influencers = await Influencer.find().populate('userId', 'name email');
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get influencer by ID
const getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id).populate('userId', 'name email');
    if (!influencer) return res.status(404).json({ message: 'Influencer not found' });
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update influencer
const updateInfluencer = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) return res.status(404).json({ message: 'Influencer not found' });

    Object.assign(influencer, req.body);
    await influencer.save();

    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete influencer
const deleteInfluencer = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) return res.status(404).json({ message: 'Influencer not found' });

    await influencer.deleteOne();
    res.json({ message: 'Influencer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInfluencer,
  getInfluencers,
  getInfluencerById,
  updateInfluencer,
  deleteInfluencer,
};