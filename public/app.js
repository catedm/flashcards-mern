import {
  DeckCTRL
} from './decks';
import {
  UICtrl
} from './ui';
import {
  StorageCTRL
} from './storage';

// listen for DOMLoaded and then get decks from local storage
document.addEventListener('DOMContentLoaded', displayDecks);

// listen for add deck click
UICtrl.addDeckSubmit.addEventListener('click', addDeck);

// list for add deck cancel click
UICtrl.addDeckCancel.addEventListener('click', UICtrl.clearAddDeckInput.bind(UICtrl));

// listen for rename deck link click
UICtrl.deckTableBody.addEventListener('click', deckOptionsLinkClick);

// listen for rename deck submit
UICtrl.renameDeckSubmit.addEventListener('click', renameDeckSubmit);

function displayDecks() {
  StorageCTRL.displayDecks();
}

function addDeck(e) {
  // get the title of the new deck
  var deckTitle = e.target.parentElement.previousElementSibling.firstElementChild.value.trim();
  // validate title
  if (deckTitle === '') {
    UICtrl.showAlert('Please enter a deck name.', 'uk-alert-primary');
    UICtrl.clearAddDeckInput();
    return;
  }
  // create the new deck
  var deck = DeckCTRL.createDeck(deckTitle);
  // Add deck to local storage
  StorageCTRL.addDeck(deck);
  // Add deck to data structure
  DeckCTRL.addDeck(deckTitle);
  // Refresh decks in the ui
  UICtrl.getDecks(StorageCTRL.getDecks());
  // Add confirmation message
  UICtrl.showAlert('Deck added', 'uk-alert-success');
}

function deckOptionsLinkClick(e) {
  if
  // this guard clause prevents an error when clicking on the SVG icon
  // in the options button
  (e.target.tagName === 'svg') {
    return;
  }
  else if
  (e.target.className.includes('rename')) {
    // Get and set current deck name in Rename Deck modal
    var name = e.target.closest('tr').firstElementChild.textContent;
    // Set the name in the ui
    UICtrl.setRenameDeckInput(name);
    // Set the id to the hidden input field in the rename modal
    // We need this in the rename deck modal in order to access the deck in the data structure using the id
    UICtrl.renameDeckIdInput.value = e.target.closest('tr').dataset.id;
  }
  else if
  (e.target.className.includes('delete')) {
    var id = parseInt(e.target.closest('tr').dataset.id);
    UIkit.modal.confirm('Are you sure you want to delete this deck?').then(function() {
      StorageCTRL.removeDeckById(id);
      DeckCTRL.removeDeckById(id);
      UICtrl.removeDeck(id);
      UICtrl.showAlert('Deck removed', 'uk-alert-success');
    }, function() {
      return;
    });
  }
}

function renameDeckSubmit(e) {
  var title = UICtrl.renameDeckInput.value.trim();
  var id = parseInt(UICtrl.renameDeckIdInput.value);
  if (title === "") {
    UICtrl.showAlert('Please rename your deck.', 'uk-alert-primary');
    UICtrl.clearRenameDeckInput();
    return;
  }
  var renameDeckIdAndName = {
    id: id,
    title: title
  }
  DeckCTRL.renameDeck(renameDeckIdAndName);
  StorageCTRL.renameDeck(renameDeckIdAndName);
  UICtrl.renameDeck(renameDeckIdAndName);
  UICtrl.showAlert('Deck updated', 'uk-alert-success');
}
