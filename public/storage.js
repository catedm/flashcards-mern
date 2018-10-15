import {
  UICtrl
} from './ui';

class Storage {
  getDecks() {
    var decks;

    if (localStorage.getItem('decks') === null) {
      decks = [];
    } else {
      decks = JSON.parse(localStorage.getItem('decks'));
    }

    return decks;
  }

  displayDecks() {
    var decks = this.getDecks();
    UICtrl.getDecks(decks);
  }

  addDeck(deck) {
    var decks = this.getDecks();

    decks.push(deck);

    localStorage.setItem('decks', JSON.stringify(decks));
  }

  getDeckById(id) {
    var decks = this.getDecks();
    return decks.find(deck => {
      return deck.id === id;
    });
  }

  renameDeck(deckIdAndTitle) {
    var id = deckIdAndTitle.id;
    var title = deckIdAndTitle.title
    var decks = this.getDecks();

    decks.map(deck => {
      if (deck.id === id) {
        deck.title = title;
      }
    });

    localStorage.setItem('decks', JSON.stringify(decks));
  }

  removeDeckById(id) {
    var decks = this.getDecks();
    var index = decks.findIndex(deck => deck.id === id);

    if (index === -1) {
      UICtrl.showAlert('Deck does not exist.', 'uk-alert-danger');
    }

    decks.splice(index, 1);
    localStorage.setItem('decks', JSON.stringify(decks));
  }
}

export const StorageCTRL = new Storage();
