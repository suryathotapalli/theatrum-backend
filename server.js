const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Welcome to THEATRUM Backend API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const cors = require('cors');
app.use(cors());
