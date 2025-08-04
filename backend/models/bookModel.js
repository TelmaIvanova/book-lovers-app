const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

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
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
  coverImage: {
    type: String,
    required: true,
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
  rating: { type: Number, default: 0 },
  r1: { type: Number, default: 0 },
  r2: { type: Number, default: 0 },
  r3: { type: Number, default: 0 },
  r4: { type: Number, default: 0 },
  r5: { type: Number, default: 0 },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
