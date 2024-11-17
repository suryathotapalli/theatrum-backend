const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Array of references to Movie documents
}, {
  timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

// Compile and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;
