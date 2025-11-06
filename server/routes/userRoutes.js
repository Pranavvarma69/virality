const express = require('express');
const router = express.Router();
const User = require('../models/user');   // Capitalize model name by convention
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password,role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Mongoose middleware hashes password, so just pass raw password here
    const newUser = await User.create({ name, email, password,role });

    if (newUser) {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role:newUser.role,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('/login route hit');
  const { email, password } = req.body;
  console.log('Login Request Body:', req.body);

  try {
    const foundUser = await User.findOne({ email });
    console.log('User found:', foundUser);

    if (!foundUser) {
      console.log(' User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log(' Incorrect password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('✅ Login successful, token:', token);

    res.status(200).json({
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      role:foundUser.role,
      token,
    });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
