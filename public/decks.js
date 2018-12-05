// global DOM selector variables
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
var deleteDeckSumit = document.querySelector('.delete-deck-submit');
var deckTableBody = document.querySelector('.deck-table-body');
var deckTable = document.querySelector('.deck-table');
var deckSuccessContainer = document.querySelector('.deck-success-container');
var navBar = document.querySelector('.uk-navbar-container');
var flashContainer = document.querySelector('.flash-container');
var { on } = UIkit.util;

var decksModule = (function () {
  // add deck to database
  var addDeck = function () {
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
  var deleteDeck = function () {
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
  var renameDeck = function () {
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

  var sendXHRRequest = function (method, url, object) {
    // perform XHR request
    var xhr = new XMLHttpRequest();
    // set method
    xhr.open(`${method}`, `/${url}`, true);
    // set content type
    xhr.setRequestHeader("Content-type", "application/json");
    // send object
    xhr.send(JSON.stringify(object));
  }

  var showAlert = function (message, className) {
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
      clearAlert();
    }, 2500);
  }

  var clearAlert = function () {
    var currentAlert = document.querySelector('.uk-alert');

    // remove alert if it is already on the page
    if (currentAlert) {
      currentAlert.remove();
    }
  }

  var clearAddDeckInputOnModalClose = function () {
    // clear add deck input on modal close
    on($('#add-deck-modal'), 'hide', () => {
      addDeckInput.value = '';
      toggleAddDeckSubmitButtonState(true);
    });
  }

  var toggleAddDeckSubmitButtonState = function(disabledValue) {
    addDeckSubmitAlert.style.display = disabledValue ? 'block' : 'none';
    addDeckSubmit.disabled = disabledValue;
  }
  
  var toggleRenameDeckSubmitButtonState = function(disabledValue) {
    renameDeckSubmitAlert.style.display = disabledValue ? 'block' : 'none';
    renameDeckSubmit.disabled = disabledValue;
  }

  var deckOptionsLinkClick = function(e) {
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

  return {
    addDeck,
    renameDeck,
    deleteDeck,
    toggleAddDeckSubmitButtonState,
    toggleRenameDeckSubmitButtonState,
    clearAddDeckInputOnModalClose,
    deckOptionsLinkClick,
    showAlert
  }

})();

// must use jquery to attach event lisener to the deck table now, and in the future
// the deck table gets rebuilt via XMLHttpRequest everytime a deck is renamed, added or deleted
$('.table-wrapper-outer').on('click', '.deck-table', {}, function (e) {
  decksModule.deckOptionsLinkClick(e);
});

// set modal contents to clear on modal close
decksModule.clearAddDeckInputOnModalClose();

// add deck submit click
addDeckSubmit.addEventListener('click', function(e) {
  decksModule.addDeck();
});

// Manipulate add deck submit button depending on input value
addDeckInput.addEventListener('keyup', function (e) {
  this.value.trim().length > 0 ? decksModule.toggleAddDeckSubmitButtonState(false) : decksModule.toggleAddDeckSubmitButtonState(true);
});

// Manipulate rename deck submit button depending on input value
renameDeckInput.addEventListener('keyup', function (e) {
  this.value.trim().length > 0 ? decksModule.toggleRenameDeckSubmitButtonState(false) : decksModule.toggleRenameDeckSubmitButtonState(true);
});

// when the alter div is visible in the DOM and is clicked, show the alert
addDeckSubmitAlert.addEventListener('click', function (e) {
  decksModule.showAlert('Please enter a deck name.', 'uk-alert-primary');
});

// when the alter div is visible in the DOM and is clicked, show the alert
renameDeckSubmitAlert.addEventListener('click', function (e) {
  decksModule.showAlert('Please rename your deck.', 'uk-alert-primary');
});

// rename deck on submission
renameDeckSubmit.addEventListener('click', function(e) {
  decksModule.renameDeck();
});

// delete deck on submission
deleteDeckSumit.addEventListener('click', function(e) {
  decksModule.deleteDeck();
});
