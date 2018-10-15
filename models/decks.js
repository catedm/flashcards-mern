const mongoose = require('mongoose');

const deckItem = new mongoose.Schema({
  title: { type: String,  required: true},
  cards: Array,
  date: { type: Date, default: Date.now }
});

const Deck = mongoose.model('Decks', deckItem);

async function createItem(title) {
  const deck = new Deck({
    title: title,
    cards: []
  });

  const result = await deck.save();
  console.log(result);
};
