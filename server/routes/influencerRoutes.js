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

router.post('/', protect, createInfluencer);
router.get('/', protect, getInfluencers);
router.get('/:id', protect, getInfluencerById);
router.put('/:id', protect, updateInfluencer);
router.delete('/:id', protect, admin, deleteInfluencer);

module.exports = router;