const mongoose = require('mongoose');

// Define the Movie schema
const movieSchema = new mongoose.Schema(
  {
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
    video: {
      type: String, // Keep videoUrl as required
      required: true,
    },
    description: {
      type: String, // Make description optional
      default: '', // Default value for description
    },
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
