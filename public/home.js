var addDeckSubmit = document.querySelector('.add-deck-submit');
var addDeckSubmitAlert = document.querySelector('.add-deck-submit-alert');
var addDeckCancel = document.querySelector('.add-deck-cancel');
var addDeckInput = document.querySelector('.add-deck-input');
var addDeckModalBackground = document.querySelector('#add-deck-modal');
var addDeckModal = document.querySelector('.add-deck-modal');
var renameDeckInput = document.querySelector('.rename-deck-input');
var renameDeckSubmit = document.querySelector('.rename-deck-submit');
var renameDeckLink = document.querySelector('.rename-deck');
var renameDeckModal = document.querySelector('.rename-deck-modal');
var renameDeckIdInput = document.querySelector('.rename-deck-id');
var renameDeckSubmitAlert = document.querySelector('.rename-deck-submit-alert');
var deleteDeckIdInput = document.querySelector('.delete-deck-id');
var deckTableBody = document.querySelector('.deck-table-body');
var deckTable = document.querySelector('.deck-table');
var deckSuccessContainer = document.querySelector('.deck-success-container');
var navBar = document.querySelector('.uk-navbar-container');
var flashContainer = document.querySelector('.flash-container');
var { on } = UIkit.util;

// add deck to database
function addDeck() {
  // build deck object to send to server
  var newDeck = {
    deckTitle: addDeckInput.value
  };
  // send request to server
  sendXHRRequest('POST', 'add-deck', newDeck);
  // show success messsage
  showAlert('Deck added.', 'uk-alert-success');
  // remove modal
  UIkit.modal("#add-deck-modal").hide();
  // reload deck table, update DOM
  $(".table-wrapper-outer").load(window.location.href + " .table-wrapper-inner");
}

// delete deck
function deleteDeck() {
  // build deck object to send to server
  var deck = {
    deckId: deleteDeckIdInput.value
  };
  // send request to server
  sendXHRRequest('DELETE', 'delete-deck', deck);
  // show success messsage
  showAlert('Deck deleted.', 'uk-alert-success');
  // remove modal
  UIkit.modal("#delete-deck-modal").hide();
  // reload deck table, update DOM
  $(".table-wrapper-outer").load(window.location.href + " .table-wrapper-inner");
}

// rename deck
function renameDeck() {
  // build deck object to send to server
  var deck = {
    newTitle: renameDeckInput.value,
    deckId: renameDeckIdInput.value
  };
  // send request to server
  sendXHRRequest('PUT', 'rename-deck', deck);
  // show success messsage
  showAlert('Deck renamed.', 'uk-alert-success');
  // remove modal
  UIkit.modal("#rename-deck-modal").hide();
  // reload deck table, update DOM
  $(".table-wrapper-outer").load(window.location.href + " .table-wrapper-inner");
}

function sendXHRRequest(method, url, object) {
  // perform XHR request
  var xhr = new XMLHttpRequest();
  xhr.open(`${method}`, `http://localhost:3030/${url}`, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(object));
}

function showAlert(message, className) {
  var currentAlert = document.querySelector('.uk-alert');
  // return if the alert is already in the DOM
  if (currentAlert) {
    return
  };

  // build template
  var alertTemplate = `<div class="${className} uk-margin" uk-alert>
                        <a class="uk-alert-close" uk-close></a>
                        <p>${message}</p>
                      </div>`;

  // Create div
  var alertTemplateContainer = document.createElement('div');
  // Add margin class
  alertTemplateContainer.className = 'uk-margin';
  // Set div HTML
  alertTemplateContainer.innerHTML = alertTemplate;
  // Add div to DOM
  if (className.includes('primary')) {
    // check if is the add deck module OR the rename deck module
    if (message.includes('enter')) {
      addDeckInput.parentElement.append(alertTemplateContainer);
    } else if (message.includes('rename')) {
      renameDeckInput.parentElement.append(alertTemplateContainer);
    }
  } if (className.includes('success')) {
    flashContainer.appendChild(alertTemplateContainer);
  }

  // Timeout
  setTimeout(() => {
    this.clearAlert();
  }, 2500);
}

function clearAlert() {
  var currentAlert = document.querySelector('.uk-alert');

  // check if an alert is already on the page, remove if it is
  if (currentAlert) {
    currentAlert.remove();
  }
}

// Manipulate add deck submit button depending on input value
addDeckInput.addEventListener('keyup', function(e) {
  this.value.trim().length > 0 ? toggleAddDeckSubmitButtonState(false) : toggleAddDeckSubmitButtonState(true);
});

// Manipulate rename deck submit button depending on input value
renameDeckInput.addEventListener('keyup', function(e) {
  this.value.trim().length > 0 ? toggleRenameDeckSubmitButtonState(false) : toggleRenameDeckSubmitButtonState(true);
});

// clear add deck input on modal close
on($('#add-deck-modal'), 'hide', () => {
  addDeckInput.value = '';
  toggleAddDeckSubmitButtonState(true);
});

function toggleAddDeckSubmitButtonState(disabledValue) {
  addDeckSubmitAlert.style.display = disabledValue ? 'block' : 'none';
  addDeckSubmit.disabled = disabledValue;
}

function toggleRenameDeckSubmitButtonState(disabledValue) {
  renameDeckSubmitAlert.style.display = disabledValue ? 'block' : 'none';
  renameDeckSubmit.disabled = disabledValue;
}

addDeckSubmitAlert.addEventListener('click', function(e) {
  showAlert('Please enter a deck name.', 'uk-alert-primary');
});

renameDeckSubmitAlert.addEventListener('click', function(e) {
  showAlert('Please rename your deck.', 'uk-alert-primary');
});

// must use jquery to attach event lisener to the deck table now, and in the future
// the deck table gets rebuilt via XMLHttpRequest everytime a deck is renamed, added or deleted
$('.table-wrapper-outer').on('click', '.deck-table' , {} ,function(e){
 deckOptionsLinkClick(e);
});

function deckOptionsLinkClick(e) {
  // this guard clause prevents an error when clicking on the SVG icon
  // in the options button
  if
  (e.target.tagName === 'svg') {
    return;
  }
  else if
  (e.target.className.includes('rename')) {
    // Make sure rename submit button is active
    renameDeckSubmit.disabled = false;
    renameDeckSubmitAlert.style.display = 'none';
    // Get and set current deck name and id in Rename Deck modal
    var name = e.target.closest('tr').firstElementChild.textContent;
    var id = e.target.closest('tr').dataset.id;
    // Set the name in the ui
    renameDeckInput.value = name;
    // Set the id to the hidden input field in the rename modal
    // We need this in the rename deck modal in order to access the deck in the data structure using the id
    renameDeckIdInput.value = id;
  }
  else if
  (e.target.className.includes('delete')) {
    // Set the id to the hidden input field in the rename modal
    // We need this in the rename deck modal in order to access the deck in the data structure using the id
    var id = e.target.closest('tr').dataset.id;
    deleteDeckIdInput.value = id;
  }
}
