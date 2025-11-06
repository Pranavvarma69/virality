const express = require('express');
const router = express.Router();
const {
  connectSocialAccount,
  getSocialAccounts
} = require('../controllers/socialAccountController');
const { protect } = require('../middleware/authMiddleware');

// Connect an influencer's social account
router.post('/:id/social', protect, connectSocialAccount);

// Get all linked social accounts
router.get('/:id/social', protect, getSocialAccounts);

module.exports = router;