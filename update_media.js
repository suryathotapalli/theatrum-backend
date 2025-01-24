const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

// Load Movie model
const Movie = require('./models/Movie');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Paths to files
const thumbnailFilePath = './thumbnail_urls.txt';
const videoFilePath = './video_urls.txt';

async function updateMedia() {
  // Read thumbnails
  const thumbnailUrls = fs.readFileSync(thumbnailFilePath, 'utf-8').split('\n').filter(url => url.trim() !== '');
  for (const url of thumbnailUrls) {
    const fileName = url.split('/').pop();
    const [genre, title, language] = fileName.replace('.jpg', '').split('_').map(part => part.trim());

    await Movie.findOneAndUpdate(
      { title: title, genre: genre, language: language },
      { thumbnail: url },
      { new: true }
    );
  }

  // Read videos
  const videoUrls = fs.readFileSync(videoFilePath, 'utf-8').split('\n').filter(url => url.trim() !== '');
  for (const url of videoUrls) {
    const fileName = url.split('/').pop();
    const [genre, title, language] = fileName.replace('.mp4', '').split('_').map(part => part.trim());

    await Movie.findOneAndUpdate(
      { title: title, genre: genre, language: language },
      { video: url },
      { new: true }
    );
  }

  mongoose.connection.close();
  console.log('Thumbnails and videos updated successfully.');
}

updateMedia();
