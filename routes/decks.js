const express = require('express');
const router = express.Router();
const { Deck, generateCardId } = require('../models/decks');

router.get('/', async (req, res, next) => {
  Deck.find(function(e, deck) {
    res.render('home.handlebars', {
      expressFlash: req.flash('success'),
      decks: deck
    })
  })
});

router.get('/decks/:id', async (req, res, next) => {
  const deck = await Deck.findById(req.params.id).catch(err => (err));

  if (!deck) return res.status(404).send('Deck with the given id not found.');

  res.render('deck.handlebars', {
    expressFlash: req.flash('success'),
    currentDeck: deck
  })
});

router.post('/add-deck', async (req, res, next) => {
  let deck = new Deck({ title: req.body.title });
  deck = await deck.save();

  req.flash('success', 'Deck added.');
  res.redirect('/');
});

router.put('/rename-deck', async (req, res, next) => {
  const deck = await Deck.findOneAndUpdate({ _id: req.body.deckId }, { $set: { title: req.body.newTitle } }, { new: true });

  req.flash('success', 'Deck renamed.');
  res.redirect('/');
});

router.delete('/delete-deck', async (req, res, next) => {
  const deck = await Deck.findOneAndRemove({ _id: req.body.deckId });

  req.flash('success', 'Deck removed.');
  res.redirect('/');
});

router.post('/add-card', async (req, res, next) => {
  let deck = await Deck.findById(req.body.deckId).catch(err => (err));
  const boundGenerateCardId = generateCardId.bind(deck);

  const newCard = {
    front: req.body.frontValue,
    back: req.body.backValue,
    id: boundGenerateCardId()
  }

  deck.cards.push(newCard);
  deck = await deck.save();

  req.flash('success', 'Card added.');
  res.redirect(`/decks/${req.body.deckId}`);
});

module.exports = router;
