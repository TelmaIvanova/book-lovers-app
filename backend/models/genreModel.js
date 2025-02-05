const mongoose = require('mongoose');
const discussion = require('./../models/discussionModel');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A group must contain name!'],
    unique: true,
  },
  // discussions: [discussion],
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
