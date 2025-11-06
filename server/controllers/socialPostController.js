const SocialPost = require('../models/postschema');

// Create or add a social post
const createPost = async (req, res) => {
  try {
    const { influencerId, platform, postId, text, createdAt, metrics } = req.body;

    const post = await SocialPost.create({
      influencerId,
      platform,
      postId,
      text,
      createdAt,
      metrics,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all posts for an influencer
const getPostsByInfluencer = async (req, res) => {
  try {
    const influencerId = req.params.id;
    const posts = await SocialPost.find({ influencerId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update post metrics (likes, shares, etc.)
const updatePostMetrics = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    Object.assign(post.metrics, req.body.metrics);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPostsByInfluencer, getPostById, updatePostMetrics };