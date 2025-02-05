const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A book must contain a title!'],
    trim: true,
    unique: true,
  },
  author: {
    type: String,
    required: [true, 'A book must contain an author!'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'A book must contain an ISBN!'],
    trim: true,
    validate: {
      validator: function (val) {
        return validator.isISBN(val);
      },
      message: 'A book must contain a valid ISBN!',
    },
  },
  publishedYear: {
    type: Number,
    required: [true, 'A book must contain a published year!'],
    trim: true,
  },
  imageCover: {
    type: String,
    //required: [true, 'A book must contain a cover image!'],
  },
  genre: {
    type: String,
    required: [true, 'A book must contain a genre!'],
  },
  summary: {
    type: String,
    required: [true, 'A book must contain a summary!'],
  },
  comment: String,
  rating: Number,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
