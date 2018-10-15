import {
  StorageCTRL
} from './storage';

class Deck {
  constructor() {
    this.decks = StorageCTRL.getDecks();
  }

  createDeck(title) {
    return {
      id: this.generateDeckId(),
      title: title,
      cards: [],
      dateAdded: new Date()
    }
  }

  addDeck(title) {
    var newDeck = this.createDeck(title);
    this.decks.push(newDeck);
    return newDeck;
  };

  generateDeckId() {
    if (this.decks.length === 0) {
      return 1;
    } else {
      return this.decks[this.decks.length - 1].id + 1;
    }
  }

  removeDeckById(id) {
    var index = this.decks.findIndex(deck => deck.id === id);

    if (index === -1) {
      console.log('Deck not found');
      return;
    }

    this.decks.splice(index, 1);
    return this.decks;
  }

  getDeckById(id) {
    return this.decks.find(deck => {
      return deck.id === id;
    });
  }

  getDecks() {
    return this.decks;
  }

  addCardToDeck(front, back, deckId) {
    if (front === "" || back === "") {
      console.log('Must enter front and back value');
      return;
    }
    // find the deck by id
    var deck = this.decks.filter(deck => deck.id === deckId)[0];

    // Verify deck exists
    if (!deck) {
      console.log('Deck not found');
      return;
    }

    // add card to that deck
    deck.cards.push({
      id: this.cardIdMaker().next().value,
      front,
      back
    });

    return deck;
  }


  generateCardId() {
    if (this.decks.length === 0) {
      return 1;
    } else {
      return this.decks[this.decks.length - 1].id + 1;
    }
  }

  removeCardFromDeck(deckId, cardId) {
    // find the deck by id
    var deck = this.decks.filter(deck => deck.id === deckId)[0];

    // make sure deck exists
    if (!deck) {
      console.log('Deck does not exist.');
      return;
    }

    // find card by index
    var index = deck.cards.findIndex(card => card.id === cardId);
    // remove card from deck
    deck.cards.splice(index, 1);

    return deck;
  }

  getCardsInDeck(id) {
    // find the deck by id
    var deck = this.decks.filter(deck => deck.id === id)[0];

    // make sure deck exists
    if (!deck) {
      console.log('Deck does not exist.');
      return;
    }

    return deck.cards;
  }

  renameDeck(deckIdAndName) {
    var deck = this.getDeckById(deckIdAndName.id);
    deck.title = deckIdAndName.title;
    return this.getDecks();
  }
}

export const DeckCTRL = new Deck();
