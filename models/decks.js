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

function generateCardId() {
  if (this.cards.length === 0) {
    return 1;
  } else {
    return this.cards[this.cards.length - 1].id + 1;
  }
}

exports.generateCardId = generateCardId;
exports.Deck = Deck;
