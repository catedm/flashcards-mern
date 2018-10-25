const { Deck } = require('../models/decks');
const express = require('express');
const router = express.Router();

router.get('/:id/cards', async (req, res) => {
  const deck = await Deck.findById(req.params.id);

  if (!deck) return res.status(404).send('Deck with the given id not found.');

  res.send(deck.cards);
});

module.exports = router;
