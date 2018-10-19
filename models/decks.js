const mongoose = require('mongoose');

const Deck = mongoose.model('Decks', mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  cards: Array,
  date: {
    type: Date,
    default: Date.now
  }
}));

exports.Deck = Deck;
