// global DOM selector variables
var addCardForm = document.querySelector('.add-card-form');
var addCardFormContainer = document.querySelector('.add-card-form-container');
var addCardMenuLink = document.querySelector('.add-card');

var addCardModule = (function () {

  var frontEditor;
  var backEditor;
  var { on } = UIkit.util;

  var addCardTemplate = async function () {

    var template = `
      <div class="uk-grid-collapse uk-margin-bottom" uk-grid>
        <div class="add-card-form-container uk-width-expand@m">
          <div class="card-body card-body-front uk-padding">
            <h4>Challenge</h4>
            <!-- Create the editor container -->
            <div id="front-editor">
            </div>
          </div>
        </div>
      </div>
      <div class="uk-grid-collapse" uk-grid>
        <div class="add-card-form-container uk-width-expand@m">
          <div class="card-body card-body-back uk-padding">
            <h4>Solution</h4>
            <!-- Create the editor container -->
            <div id="back-editor">
            </div>
          </div>
        </div>
      </div>
      <input type="hidden" name="frontValue" value="">
      <input type="hidden" name="backValue" value="">
      <input type="hidden" name="deckId" value="">
      <p class="uk-text-right uk-margin-remove-bottom">
        <button class="add-card-cancel uk-button uk-button-default uk-modal-close" type="button">Close</button>
        <input class="add-card-submit uk-button uk-button-primary" type="button" value="Add Card" >
      </p>
    `;

    addCardForm.innerHTML = template;

    let toolbarOptions = await getDeckSettings();

    frontEditor = new Quill('#front-editor', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    backEditor = new Quill('#back-editor', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });;

    frontEditor.on('editor-change', frontUpdate);
    backEditor.on('editor-change', backUpdate);

  }

  var clearAddCardModalContents = function () {
    addCardForm.innerHTML = '';
  }

  var addCard = function () {
    // get deck Id from url
    var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

    // make card to send to route handler
    var card = {
      frontValue: document.querySelector("input[name='frontValue']").value,
      backValue: document.querySelector("input[name='backValue']").value,
      deckId: deckId
    }

    // make sure there is a front and back value
    if (!!verifyFrontAndBackValues(card)) {
      flashMessage('Please enter a challenge and a solution', 'error');
      return;
    }

    // send XHR request to database
    sendXHRRequest(card);

    // reset form
    resetAddCardForm();

    // refresh div to update card count
    $(".card-count-container").load(window.location.href + " #card-count");
    // reload button text
    $(".top-button-container-outer").load(window.location.href + " .top-button-container-inner");

    // add success message
    flashMessage('Card added', 'success');

  }

  // verify front and back value of cards
  var verifyFrontAndBackValues = function (card) {
    // build variables that hold truthy values based on card input
    var isFrontBlank = card.frontValue.trim() === '' || JSON.parse(card.frontValue).ops[0].insert.trim() === '';
    var isBackBlank = card.backValue.trim() === '' || JSON.parse(card.backValue).ops[0].insert.trim() === '';
    var areBothBlank = isFrontBlank && isBackBlank;

    // alter CSS depending on which sides are blank
    if (areBothBlank) {
      document.querySelector('.card-body-front').style.borderColor = 'red';
      document.querySelector('.card-body-back').style.borderColor = 'red';
      return true;
    } else if (isFrontBlank) {
      document.querySelector('.card-body-front').style.borderColor = 'red';
      return true;
    } else if (isBackBlank) {
      document.querySelector('.card-body-back').style.borderColor = 'red';
      return true;
    }
  };

  var flashMessage = function (message, type) {
    let messageDiv = document.createElement('div');

    if (type === 'success') {
      messageDiv.classList.add('uk-alert-success');
      messageDiv.classList.add('add-card-success');
    } else if (type === 'error') {
      messageDiv.classList.add('uk-alert-danger');
      messageDiv.classList.add('add-card-danger');
    }

    messageDiv.classList.add('uk-margin-bottom');
    messageDiv.setAttribute('uk-alert', '');
    messageDiv.innerHTML = `<p>${message}</p>`;
    document.querySelector('.add-card-form-container').insertBefore(messageDiv, document.querySelector('.add-card-form'));

    clearFlashMessage();
  }

  var resetAddCardForm = function () {
    frontEditor.setContents([]);
    backEditor.setContents([]);
  }

  var sendXHRRequest = function (card) {
    // perform XHR request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3030/add-card", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(card));
  }

  var clearFlashMessage = function () {
    let alert = document.querySelectorAll('div[uk-alert]')[0];
    if (alert) {
      setTimeout(function () {
        document.querySelector('.uk-alert').remove();
      }, 2000);
    }
  }

  var frontUpdate = function (delta) {
    // try / catch because the selector is added dynamically
    try {
      document.querySelector("input[name='frontValue']").value = JSON.stringify(frontEditor.getContents());
      return frontEditor.getContents();
    } catch (err) { }
  }

  var backUpdate = function (delta) {
    // try / catch because the selector is added dynamically
    try {
      document.querySelector("input[name='backValue']").value = JSON.stringify(backEditor.getContents());
      return backEditor.getContents();
    } catch (err) { }
  }

  // everytime the modal is closed, clear its contents
  var setAddCardModalContentsToClear = function () {
    on($('#add-card'), 'hide', () => {
      setTimeout(() => {
        addCardModule.clearAddCardModalContents();
      }, 500)
    });
  }

  return {
    addCardTemplate,
    clearAddCardModalContents,
    getDeckSettings,
    addCard,
    resetAddCardForm,
    setAddCardModalContentsToClear
  }

})();

// set add card module contents to disappear on modal close 
addCardModule.setAddCardModalContentsToClear();

// main menu add card listener
addCardMenuLink.addEventListener('click', function (e) {
  addCardModule.addCardTemplate();
  e.preventDefault();
});

// use event bubbling to capture add card event on add card button click
addCardFormContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('add-card-submit')) {
    addCardModule.addCard();
    e.preventDefault();
  }
});

// if there is content in the front or back add card values, remove red borders
addCardFormContainer.addEventListener('keyup', function (e) {
  if (e.target.innerText.trim() !== '') {
    document.querySelector('.card-body-front').style.borderColor = '#1e87f0';
    document.querySelector('.card-body-back').style.borderColor = '#1e87f0';
  }
});

// Try catch block here because this script is on pages that do not have the .top-button-container-outer element
// such as the deck settings page
try {
  // IF there are ZERO cards in the deck, add listener for ADD CARD button
  document.querySelector('.top-button-container-outer').addEventListener('click', function (e) {
    if (e.target.classList.contains('add-card')) {
      addCardModule.addCardTemplate();
      e.preventDefault();
    }
  });
} catch (err) { }
