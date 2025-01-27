const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Must contain a title!'],
    unique: true,
  },
  genre: {
    type: String,
    required: [true, 'Must contain a genre!'],
  },
  rating: Number,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
