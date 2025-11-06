const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to protect routes (requires valid token)
const protect = async (req, res, next) => {
  let token;

  console.log('🟦 Incoming Request Headers:', req.headers); // 👀 debug header

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🟨 Extracted Token:', token); // 👀 debug token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🟩 Decoded Token:', decoded); // 👀 debug decoded payload

      req.user = await User.findById(decoded.id).select('-password');
      console.log('🟪 User Found:', req.user); // 👀 debug user from DB

      if (!req.user) {
        console.log('❌ No user found for this token');
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('❌ JWT Verification Failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('❌ No Authorization header found');
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin check
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('✅ Admin access granted');
    next();
  } else {
    console.log('🚫 Admin access denied');
    res.status(403).json({ message: 'Admin access only' });
  }
};

// Influencer check
const influencerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'influencer') {
    console.log('✅ Influencer access granted');
    next();
  } else {
    console.log('🚫 Influencer access denied');
    res.status(403).json({ message: 'Influencer access only' });
  }
};

// Brand check
const brandOnly = (req, res, next) => {
  if (req.user && req.user.role === 'brand') {
    console.log('✅ Brand access granted');
    next();
  } else {
    console.log('🚫 Brand access denied');
    res.status(403).json({ message: 'Brand access only' });
  }
};

module.exports = { protect, admin, influencerOnly, brandOnly };