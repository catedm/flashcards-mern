// global DOM selector variables
var browseSuccessMessage = document.querySelector('.browse-success-message');
var allCardsTableBody = document.querySelector('.all-cards-table-body')
var allCardsEditCardContainer = document.querySelector('.all-cards-edit-card-container')
var searchCardsInput = document.querySelector('.search-cards')
var allCardsMenuLink = document.querySelector('.all-cards')
// Javascript hook into UI kit frontend framework to work with modal closing functionality
var { on } = UIkit.util;

var browseCardsModule = (function () {
  var frontEditor;
  var backEditor;

  // function for dynamically building the all cards browse table
  var buildAllCardsBrowseTable = async function () {
    // declare html var
    let html = ``;
    // get cards from API endpoint
    var cardsArray = await getCards();

    cardsArray.forEach(function (card) {
      // get clean strings for front and back card values
      var cleanFrontString = JSON.parse(card.front).ops[0].insert.trim();
      var cleanBackString = JSON.parse(card.back).ops[0].insert.trim();
      // add table rows to the html output
      html += `
    <tr class="card-row card-${card.id}">
      <td class="uk-text-truncate">${cleanFrontString}</td>
      <td class="uk-text-truncate">${cleanBackString}</td>
      <td>${card.id}</td>
    </tr>`;
    })
    // add the html to the table
    allCardsTableBody.innerHTML = html;
  }

  // Template for editing / deleting cards cards
  var editCardTemplate = async function (front, back, id) {

    var template = `
  <div class="uk-grid-small uk-child-width-expand@s" uk-grid>
      <div>
        <div class="card-body uk-padding">
          <h4>Front</h4>
          <!-- Create the editor container -->
          <div id="front-editor-all-cards"></div>
        </div>
      </div>
      <div>
        <div class="card-body uk-padding">
          <h4>Back</h4>
          <!-- Create the editor container -->
          <div id="back-editor-all-cards"></div>
        </div>
      </div>
  </div>
    <input type="hidden" name="frontValue" value="">
    <input type="hidden" name="backValue" value="">
    <input type="hidden" name="deckId" value="">
    <input type="hidden" name="cardId" value="${id}">
    <p class="browse-cards-buttons uk-text-right uk-margin-remove-bottom">
      <button class="all-cards-delete-card-first uk-button uk-button-danger">Delete Card</button>
      <input class="edit-card-submit uk-button uk-button-primary" type="button" value="Save Changes" />
    </p>
  `;

  allCardsEditCardContainer.innerHTML = template;

    var toolbarOptions = await getDeckSettings();

    // get the deck settings from the api settings endpoint
    frontEditor = new Quill('#front-editor-all-cards', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    backEditor = new Quill('#back-editor-all-cards', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    frontEditor.setContents(JSON.parse(front));
    backEditor.setContents(JSON.parse(back));

  }

  var deleteCardFromAllCardsBrowse = function () {
    // get deck Id from url
    var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    // get the card id
    var cardId = parseInt(document.querySelector('[name=cardId]').value);

    // build card object to pass back to the server
    var card = {
      cardId: cardId,
      deckId: deckId
    }

    // perform AJAX request, pass card back to server
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3030/delete-card", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(card));

    // refresh div to update card count
    $(".card-count-container").load(window.location.href + " #card-count");
    // reload button text
    $(".top-button-container-outer").load(window.location.href + " .top-button-container-inner");
    // remove row with card in it from table
    removeRow(cardId);
    // remove front and back of card
    clearEditCardContainerContents();
    // add success message
    browseCardsSuccess("Card deleted.");
  }

  var saveChanges = function () {
    // get deck Id from url
    var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    // get the card id
    var cardId = parseInt(document.querySelector('[name=cardId]').value);
    // build card object to send to the database
    var card = {
      frontValue: JSON.stringify(frontEditor.getContents()),
      backValue: JSON.stringify(backEditor.getContents()),
      cardId: cardId,
      deckId: deckId
    }

    // perform AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3030/save-card", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(card));

    // rebuild table to reflect new value
    buildAllCardsBrowseTable();

    // add success message
    browseCardsSuccess("Card updated.");
  }

  var browseCardsSuccess = function (message) {
    var classesToAdd = ['add-card-success', 'uk-alert-success', 'uk-margin-bottom', 'uk-width-1-1'];
    var successDiv = document.createElement('div');
    successDiv.classList.add(...classesToAdd);
    successDiv.setAttribute('uk-alert', '');
    successDiv.innerHTML = `<a class="uk-alert-close" uk-close></a><p>${message}</p>`;

    // add success message to the DOM
    browseSuccessMessage.appendChild(successDiv);

    // set timeout to clear success message
    clearSuccess();
  }

  var setBrowseCardModalContentsToClear = function () {
    // clear card filter input and edit cards contents on modal close
    on($('#all-cards'), 'hide', () => {
      searchCardsInput.value = '';
      clearEditCardContainerContents();
    });
  }

  var removeRow = function (cardId) {
    document.querySelector(`.card-${cardId}`).remove();
  }

  var clearEditCardContainerContents = function () {
    allCardsEditCardContainer.innerHTML = '';
  }

  var clearSuccess = function () {
    setTimeout(function () {
      document.querySelector('.add-card-success').remove();
    }, 2000);
  };

  var toggleBrowseCardsButtonState = function(state) {
    if (state === 'delete') {
      return `
      <span class="are-you-sure-all-cards uk-margin-right">Are you sure?</span>
      <button class="yes-delete-all-cards uk-button uk-button-danger">Yes<span class="delete-icon" uk-icon="icon: trash" style="margin-left: 8px;"></span></button>
      <button class="no-delete-all-cards uk-button uk-button-secondary">No<span class="do-not-delete-icon" uk-icon="icon: close" style="margin-left: 8px;"></span></button>
     `
    } else if (state === 'edit') {
      return `
      <button class="all-cards-delete-card-first uk-button uk-button-danger">Delete Card</button>
      <input class="edit-card-submit uk-button uk-button-primary" type="button" value="Save Changes" />
     `
    }
  }

  return {
    buildAllCardsBrowseTable,
    editCardTemplate,
    saveChanges,
    deleteCardFromAllCardsBrowse,
    setBrowseCardModalContentsToClear,
    toggleBrowseCardsButtonState
  }

})();

// set browse cards modal to clear content on modal close
browseCardsModule.setBrowseCardModalContentsToClear();

// use event bubbling to capture add card event on add card button click
allCardsEditCardContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('edit-card-submit')) {
    browseCardsModule.saveChanges();
  } else if (e.target.classList.contains('yes-delete-all-cards')) {
    browseCardsModule.deleteCardFromAllCardsBrowse();
  } else if (e.target.classList.contains('delete-icon')) {
    browseCardsModule.deleteCardFromAllCardsBrowse();
  }
});

// populate the all cards modal table with the cards in the current deck
allCardsMenuLink.addEventListener('click', function () {
  browseCardsModule.buildAllCardsBrowseTable();
});

// change the edit card table every time a card is selected
allCardsTableBody.addEventListener('click', function (e) {
  // get the id of the card selected
  var id = parseInt(e.target.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerText);
  // get cards from api endpoint
  getCards().then(cardsArray => {
    // pick selected card from the deck
    var card = cardsArray.find(card => card.id === id);
    // add the edit card template to the view
    browseCardsModule.editCardTemplate(card.front, card.back, card.id);
  });
});

// listen for delete card click
// rearrange buttons for delete card button click
allCardsEditCardContainer.addEventListener('click', function (e) {
  // initialize a state variable to track state depending on button clicked
  var state;
  if (e.target.classList.contains('all-cards-delete-card-first')) {
    // toggle the state to delete
    state = 'delete';
    document.querySelector('.browse-cards-buttons').innerHTML = browseCardsModule.toggleBrowseCardsButtonState(state);
  } else if (e.target.classList.contains('no-delete-all-cards') || e.target.classList.contains('do-not-delete-icon')) {
    // toggle the state to edit
    state = 'edit';
    document.querySelector('.browse-cards-buttons').innerHTML = browseCardsModule.toggleBrowseCardsButtonState(state);
  }
});

// initialze array for filtering (see findMatches() function)
var cards;
// get cards from api endpoint
getCards().then(data => cards = data);

searchCardsInput.addEventListener('click', async function (e) {
  // when the search bar is selected, the cards needs to be refreshed from the database
  // otherwise, already deleted cards will show up in the search
  // get cards from api endpoint
  cards = await getCards();
});

// find matches during filter
function findMatches(wordToMatch, cards) {
  return cards.filter(card => {
    var regex = new RegExp(wordToMatch, 'gi');
    return card.front.match(regex) || card.back.match(regex);
  });
}

// update display to matched cards
function displayMatches() {
  var matchArray = findMatches(this.value, cards);
  var html = matchArray.map(card => {
    var regex = new RegExp(this.value, 'gi');
    var front = JSON.parse(card.front).ops[0].insert.trim().replace(regex, `<span class="hl">${this.value}</span>`);
    var back = JSON.parse(card.back).ops[0].insert.trim().replace(regex, `<span class="hl">${this.value}</span>`);
    return `
    <tr class="card-row card-${card.id}">
      <td class="uk-text-truncate">${front}</td>
      <td class="uk-text-truncate">${back}</td>
      <td>${card.id}</td>
    </tr>`;
  }).join('');

  allCardsTableBody.innerHTML = html;
}

// event listener for typing in a search
searchCardsInput.addEventListener('keyup', displayMatches);
