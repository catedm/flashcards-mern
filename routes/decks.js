const express = require('express');
const router = express.Router();
const { Deck } = require('../models/decks')

router.get('/', async (req, res, next) => {
  Deck.find(function(e, deck) {
    res.render('home.handlebars', {
      expressFlash: req.flash('success'),
      decks: deck
    })
  })
});

router.post('/add-deck', async (req, res, next) => {
  let deck = new Deck({ title: req.body.title });
  deck = await deck.save();

  req.flash('success', 'Add deck success.');
  res.redirect('/');
});

router.put('/rename-deck', async (req, res, next) => {
  const deck = await Deck.findByIdAndUpdate(req.body.deckId, { title: req.body.newTitle }, {
    new: true
  });

  req.flash('success', 'Deck renamed.');
  res.redirect('/');
});

module.exports = router;
