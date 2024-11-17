const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware
const User = require('../models/User'); // MongoDB User model
const router = express.Router();

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const newUser = new User({ name, email, password: hashedPassword, favorites: [] });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: { name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Add Movie to Favorites
router.post('/favorites/:movieId', authMiddleware, async (req, res) => {
  const { movieId } = req.params;

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the movie to the user's favorites
    user.favorites.push(movieId);
    await user.save();

    res.status(200).json({ message: `Movie ${movieId} added to favorites for user ${user.email}` });
  } catch (error) {
    res.status(500).json({ message: 'Error adding movie to favorites', error: error.message });
  }
});

router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    // Debugging logs
    console.log('Authenticated User:', req.user);

    // Find the user and populate their favorites
    const user = await User.findOne({ email: req.user.email }).populate('favorites');
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's favorites
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error in favorites endpoint:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Protected Route Example
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.name}, you have access to this protected route!` });
});

module.exports = router;
