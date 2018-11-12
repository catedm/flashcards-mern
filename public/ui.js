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
var { on } = UIkit.util;

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
    if (message.includes('enter')) {
      addDeckInput.parentElement.append(alertTemplateContainer);
    } else if (message.includes('rename')) {
      renameDeckInput.parentElement.append(alertTemplateContainer);
    }
  } if (className.includes('success')) {
    deckTable.insertAdjacentElement('beforebegin', alertTemplateContainer);
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
  toggleSubmitButtonState(true);
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

deckTableBody.addEventListener('click', deckOptionsLinkClick);

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
