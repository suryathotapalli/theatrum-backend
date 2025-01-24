const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new movie (protected route)
router.post('/', authMiddleware, async (req, res) => {
  const { title, genre, language, thumbnail, videoUrl, description } = req.body;

  try {
    const newMovie = new Movie({ title, genre, language, thumbnail, videoUrl, description });
    await newMovie.save();
    res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a movie (protected route)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error: error.message });
  }
});

// Delete a movie by ID (protected route)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch movies, search, and filter routes (public)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, genre, language } = req.query;

  let filter = {};
  if (genre) filter.genre = genre;
  if (language) filter.language = language;

  try {
    const movies = await Movie.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalMovies = await Movie.countDocuments(filter);

    res.status(200).json({
      movies,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMovies / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error });
  }
});

module.exports = router;
