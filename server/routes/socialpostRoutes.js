const express = require('express');
const router = express.Router();
const {
  createPost,
  getPostsByInfluencer,
  getPostById,
  updatePostMetrics,
} = require('../controllers/socialPostController');

const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, createPost); // create a post
router.get('/influencer/:id', protect, getPostsByInfluencer); // all posts for influencer
router.get('/:id', protect, getPostById); // single post
router.put('/:id/metrics', protect, updatePostMetrics); // update metrics

module.exports = router;