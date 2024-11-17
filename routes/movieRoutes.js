const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new movie
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

// Get all movies
// Fetch Movies with Pagination
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Get query parameters for pagination

  try {
    // Fetch movies with pagination
    const movies = await Movie.find()
      .skip((page - 1) * limit) // Skip documents for previous pages
      .limit(parseInt(limit)); // Limit the number of documents fetched

    // Count total number of movies in the database
    const totalMovies = await Movie.countDocuments();

    // Respond with movies and pagination details
    res.status(200).json({
      movies,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMovies / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch movies', error: error.message });
  }
});


// Get movies by genre or language
router.get('/filter', async (req, res) => {
    const { genre, language } = req.query;

    try {
        const query = {};
        if (genre) query.genre = genre;
        if (language) query.language = language;

        const movies = await Movie.find(query);
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a movie by ID
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

// Update Movie Details
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update movie', error });
  }
});

// Delete Movie
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete movie', error });
  }
});

module.exports = router;
