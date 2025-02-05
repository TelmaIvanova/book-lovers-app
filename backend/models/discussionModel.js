const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A discussion must contain a title!'],
  },
  createdAt: Date,
  //comments: [String],
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
