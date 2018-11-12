var frontEditor;
var backEditor;
var allCardsMenuLink = document.querySelector('.all-cards');
var allCardsTable = document.querySelector('.all-cards-table-body');
var editCardContainer = document.querySelector('.all-cards-edit-card-container');
var searchInput = document.querySelector('.search-cards');
var allCardsModalBackground = document.querySelector('#all-cards');
var browseSuccessMessage = document.querySelector('.browse-success-message');
var { on } = UIkit.util;


// get cards in current deck from api endpoint
async function getCards() {
  var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/cards`;
  var response = await fetch(url);
  var responseData = await response.json();
  return responseData;
}

// populate the all cards modal table with the cards in the current deck
allCardsMenuLink.addEventListener('click', function() {
  var html = ``;

  getCards().then(cardsArray => {
    cardsArray.forEach(function(card) {
      var cleanFrontString = JSON.parse(card.front).ops[0].insert.trim();
      var cleanBackString = JSON.parse(card.back).ops[0].insert.trim();
      html += `
      <tr class="card-row card-${card.id}">
        <td class="uk-text-truncate">${cleanFrontString}</td>
        <td class="uk-text-truncate">${cleanBackString}</td>
        <td>${card.id}</td>
      </tr>`;
    })

    allCardsTable.innerHTML = html;
  })
});

// clear card filter input and edit cards contents on modal close
on($('#all-cards'), 'hide', () => {
  searchInput.value = '';
  clearEditCardContainerContents();
});

// change the edit card table every time a card is selected
allCardsTable.addEventListener('click', function(e) {
  // get the id of the card selected
  var id = parseInt(e.target.parentNode.firstElementChild.nextElementSibling.nextElementSibling.innerText);
  // get cards from api endpoint
  getCards().then(cardsArray => {
    // pick selected card from the deck
    var card = cardsArray.find(card => card.id === id);
    // add the edit card template to the view
    editCardTemplate(card.front, card.back, card.id);
  });
});

// listen for delete card click
// rearrange buttons for delete card button click
editCardContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('all-cards-delete-card-first')) {
    document.querySelector('.all-cards-delete-card-first').style.display = 'none';
    document.querySelector('.add-card-submit').style.display = 'none';
    document.querySelector('.are-you-sure-all-cards').style.display = 'inline';
    document.querySelector('.yes-delete-all-cards').style.display = 'inline';
    document.querySelector('.no-delete-all-cards').style.display = 'inline';
  } else if (e.target.classList.contains('no-delete-all-cards') || e.target.classList.contains('do-not-delete-icon')) {
    document.querySelector('.all-cards-delete-card-first').style.display = 'inline';
    document.querySelector('.add-card-submit').style.display = 'inline';
    document.querySelector('.are-you-sure-all-cards').style.display = 'none';
    document.querySelector('.yes-delete-all-cards').style.display = 'none';
    document.querySelector('.no-delete-all-cards').style.display = 'none';
  }
});

// Template for editing / deleting cards cards
function editCardTemplate(front, back, id) {

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
    <p class="uk-text-right uk-margin-remove-bottom">
      <button class="all-cards-delete-card-first uk-button uk-button-danger">Delete Card</button>
      <span class="are-you-sure-all-cards uk-margin-right">Are you sure?</span>
      <button class="yes-delete-all-cards uk-button uk-button-danger" onclick="deleteCardFromAllCardsBrowse()">Yes<span class="delete-icon" uk-icon="icon: trash" style="margin-left: 8px;"></span></button>
      <button class="no-delete-all-cards uk-button uk-button-secondary">No<span class="do-not-delete-icon" uk-icon="icon: close" style="margin-left: 8px;"></span></button>
      <input class="add-card-submit uk-button uk-button-primary" type="button" value="Save Changes" onclick="saveChanges()"/>
    </p>
  `;

  editCardContainer.innerHTML = template;

  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];


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

function deleteCardFromAllCardsBrowse() {
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
    $("#card-count").load(window.location.href + " #card-count");
    // reload button text
    $(".top-button-container").load(window.location.href + " .top-button-container");
    // remove row with card in it from table
    removeRow(cardId);
    // remove front and back of card
    clearEditCardContainerContents();
    // add success message
    browseCardsSuccess("Card deleted.");
}

function removeRow(cardId) {
  document.querySelector(`.card-${cardId}`).remove();
}

function clearEditCardContainerContents() {
  editCardContainer.innerHTML = '';
}

function saveChanges() {
  // get deck Id from url
  var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
  // get the card id
  var cardId = parseInt(document.querySelector('[name=cardId]').value);

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

  // add success message
  browseCardsSuccess("Card updated.");
}

function browseCardsSuccess(message) {
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

function clearSuccess() {
  setTimeout(function() {
    document.querySelector('.add-card-success').remove();
  }, 2000);
};

// initialze array for filtering
var cards = [];
// get cards from api endpoint
getCards().then(data => cards = data);

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

  allCardsTable.innerHTML = html;
}

// event listener for typing in a search
searchInput.addEventListener('keyup', displayMatches);
