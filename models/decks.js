const mongoose = require('mongoose');

const Deck = mongoose.model('Decks', mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  cards: Array,
  settings: {
    type: Array,
    default: [
       'bold',
       'italic',
       'underline',
       'strike',
       'blockquote',
       'code-block',
       'clean',
       { 'header': 1 },
       { 'header': 2 },
       { 'list': 'ordered'},
       { 'list': 'bullet' },
       { 'script': 'sub'},
       { 'script': 'super' },
       { 'indent': '-1'},
       { 'indent': '+1' },
       { 'direction': 'rtl' },
       { 'size': ['small', false, 'large', 'huge'] },
       { 'header': [1, 2, 3, 4, 5, 6, false] },
       { 'color': [] },
       { 'background': [] },
       { 'font': [] },
       { 'align': [] }
    ]
  },
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
