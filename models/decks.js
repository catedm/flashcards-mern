const mongoose = require('mongoose');

const Deck = mongoose.model('Decks', mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  cards: Array,
  dateAdded: {
    type: Date,
    default: Date.now
  }
}));

exports.Deck = Deck;
