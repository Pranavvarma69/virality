const SocialAccount = require('../models/socialaccount');

// Connect / Add a social account
const connectSocialAccount = async (req, res) => {
  try {
    const influencerId = req.params.id;
    const { platform, authToken } = req.body;

    const account = await SocialAccount.create({
      influencerId,
      platform,
      authToken,
    });

    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch linked social accounts for an influencer
const getSocialAccounts = async (req, res) => {
  try {
    const influencerId = req.params.id;
    const accounts = await SocialAccount.find({ influencerId });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { connectSocialAccount, getSocialAccounts };