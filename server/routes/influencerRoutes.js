const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {
  createInfluencer,
  getInfluencers,
  getInfluencerById,
  updateInfluencer,
  deleteInfluencer,
} = require('../controllers/influencerController');
const { protect, admin } = require('../middleware/authMiddleware');
const InfluencerRanking = mongoose.connection.collection('influencer_rankings');
router.get('/top', async (req, res) => {
  try {
    const rankings = await InfluencerRanking.find({})
      .sort({ rank: 1 })
      .limit(10)
      .toArray();

    res.json(rankings);
  } catch (err) {
    console.error('❌ Error fetching influencer rankings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, createInfluencer);
router.get('/', protect, getInfluencers);
router.get('/:id', protect, getInfluencerById);
router.put('/:id', protect, updateInfluencer);
router.delete('/:id', protect, admin, deleteInfluencer);

module.exports = router;