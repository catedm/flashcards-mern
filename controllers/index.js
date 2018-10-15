const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/flashcard-app')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB.', err));

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

router.get('/', async (req, res, next) => {
  const decks = await Deck.find({});
  // send data to front end and loop over it
  res.render('home.handlebars', decks);
});

router.post('/add-deck', async (req, res, next) => {
  let deck = new Deck({ title: req.body.title });
  deck = await deck.save();
  res.render('home.handlebars', {
    deckAdded: true
  });
});

module.exports = router;
