const express = require('express');
const bcrypt = require('bcryptjs');
const Movie = require('../models/Movie'); // MongoDB Movie model
const User = require('../models/User'); // MongoDB User model
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware'); // Middleware to restrict access to admins only
const router = express.Router();

// Add a new movie
router.post('/movies/add', adminAuthMiddleware, async (req, res) => {
    const { title, genre, language, thumbnail, video } = req.body;

    try {
        const newMovie = new Movie({
            title,
            genre,
            language,
            thumbnail,
            video,
        });

        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully', movie: newMovie });
    } catch (error) {
        console.error('Error adding movie:', error.message);
        res.status(500).json({ message: 'Error adding movie', error: error.message });
    }
});

// Delete a movie
router.delete('/movies/delete/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await Movie.findByIdAndDelete(id);
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting movie:', error.message);
        res.status(500).json({ message: 'Error deleting movie', error: error.message });
    }
});

// Fetch all movies
router.get('/movies', adminAuthMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error.message);
        res.status(500).json({ message: 'Error fetching movies', error: error.message });
    }
});

// Add a new user
router.post('/users/add', adminAuthMiddleware, async (req, res) => {
    const { name, email, password, plan } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!['Basic', 'Premium','Standard','No Plan'].includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan value. Allowed: Basic, Premium,Standard No Plan' });
        }
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            plan,
        });

        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error('Error adding user:', error.message);
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
});

// Delete a user
router.delete('/users/delete/:id', adminAuthMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Fetch all users
router.get('/users', adminAuthMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;
