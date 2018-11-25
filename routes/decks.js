const express = require('express');
const router = express.Router();
var helpers = require('handlebars-helpers')();
const { Deck, generateCardId } = require('../models/decks');

router.get('/decks', async (req, res, next) => {
  Deck.find(function(e, deck) {
    res.render('home.handlebars', {
      decks: deck
    })
  })
});

router.get('/', (req, res, next) => {
  res.redirect('/decks');
});

router.get('/decks/:id', async (req, res, next) => {
  const deck = await Deck.findById(req.params.id).catch(err => (err));

  if (!deck) return res.status(404).send('Deck with the given id not found.');

  res.render('deck.handlebars', {
    currentDeck: deck
  });
});

router.get('/decks/settings/:id', async (req, res, next) => {
  const deck = await Deck.findById(req.params.id).catch(err => (err));

  if (!deck) return res.status(404).send('Deck with the given id not found.');

  res.render('deck-settings.handlebars', {
    currentDeck: deck
  });
});

router.post('/add-deck', async (req, res, next) => {
  let deck = new Deck({ title: req.body.deckTitle });
  await deck.save();
  res.send(deck);
});

router.put('/rename-deck', async (req, res, next) => {
  const deck = await Deck.findOneAndUpdate({ _id: req.body.deckId }, { $set: { title: req.body.newTitle } }, { new: true });
  res.send(deck);
});

router.delete('/delete-deck', async (req, res, next) => {
  const deck = await Deck.findOneAndDelete({ _id: req.body.deckId });
  res.send('Deck deleted');
});

router.post('/add-card', async (req, res, next) => {
  let deck = await Deck.findById(req.body.deckId).catch(err => (err));
  // generate card id
  // must bind execution context
  const boundGenerateCardId = generateCardId.bind(deck);

  const newCard = {
    front: req.body.frontValue,
    back: req.body.backValue,
    id: boundGenerateCardId()
  }

  deck.cards.push(newCard);
  deck = await deck.save();
  res.send(deck);
});

router.put('/save-card', async (req, res, next) => {
  // grab deck from database
  let deck = await Deck.findById(req.body.deckId).catch(err => (err));

  // make the new card object
  const newCard = {
    front: req.body.frontValue,
    back: req.body.backValue,
    id: req.body.cardId
  }

  // get index of card to update
  const index = deck.cards.findIndex(card => card.id === newCard.id);
  // set the new card
  deck.cards.splice(index, 1, newCard);

  // save the new cards to the database
  deck = await Deck.findOneAndUpdate({ _id: req.body.deckId }, { $set: { cards: deck.cards } }, { new: true });
  deck = await deck.save();
  res.send(deck);
});

router.put('/update-toolbarsettings', async (req, res, next) => {
  // grab deck from database
  let deck = await Deck.findById(req.body.deckId).catch(err => (err));


  // save the new settings to the database
  deck = await Deck.findOneAndUpdate({ _id: req.body.deckId }, { $set: { settings: req.body.toolbarOptions } }, { new: true });
  deck = await deck.save();
  res.send(deck);
});

router.delete('/delete-card', async (req, res, next) => {
  // grab deck from database
  let deck = await Deck.findById(req.body.deckId).catch(err => (err));

  // get index of card to delete
  const index = deck.cards.findIndex(card => card.id === req.body.cardId);
  // set the new card
  deck.cards.splice(index, 1);

  // save the new cards to the database
  deck = await Deck.findOneAndUpdate({ _id: req.body.deckId }, { $set: { cards: deck.cards } }, { new: true });
  deck = await deck.save();
  res.send(deck);
});

module.exports = router;
