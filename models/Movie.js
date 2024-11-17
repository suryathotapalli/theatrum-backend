const mongoose = require('mongoose');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
