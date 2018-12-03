var topButtonContainerOuter = document.querySelector('.top-button-container-outer');
var studyContainer = document.querySelector('.study-container');
var progressbarContainer = document.querySelector('.progress-bar-container');
// initialize front editor and back editor variables in global scope
var frontEditor;
var backEditor;
// this variable represents the deck while someone is studying
var currectDeck;

var studyModule = (function () {

  var shuffle = function (array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  var nextCard = async function () {
    const currentCard = currectDeck.next().value;

    if (currentCard !== undefined) {
      document.querySelector('.study-container').innerHTML = `
    <div class="card-front uk-grid-collapse uk-margin-bottom" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <!-- Create the editor container -->
          <div id="front">
          </div>
        </div>
      </div>
    </div>
    <div class="card-back uk-grid-collapse" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <!-- Create the editor container -->
          <div id="back">
          </div>
        </div>
      </div>
    </div>
    <p class="study-buttons uk-text-right">
      <button class="show-answer uk-button uk-button-primary">Show Answer</button>
    </p>
    <p class="uk-text-right">
    <input class="hiddenCardId" type="hidden" value="${currentCard.id}" />
    `;

      let toolbarOptions = await getDeckSettings();

      frontEditor = new Quill('#front', {
        modules: {
          syntax: true,
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });

      backEditor = new Quill('#back', {
        modules: {
          syntax: true,
          toolbar: toolbarOptions
        },
        theme: 'snow'
      });

      frontEditor.setContents(JSON.parse(currentCard.front));
      backEditor.setContents(JSON.parse(currentCard.back));
      backEditor.enable(false);

    } else {
      // No more cards
      document.querySelector('.study-container').innerHTML = '';
      var studyButton = document.querySelector('.exit-study');
      studyButton.classList.remove('exit-study');
      studyButton.classList.add('study-now');
      document.querySelector('.study-now').innerText = "Study Now";
      document.querySelector('.study-now').disabled = false;
      // clear progress bar container
      removeProgressBar();
      successMessage("You finished this deck!");
    }
  }

  var removeProgressBar = function () {
    progressbarContainer.innerHTML = '';
  };

  var initializeProgressbar = function (cardsArray) {
    progressbarContainer.innerHTML = `<progress id="js-progressbar" class="uk-progress" value="1" max="${cardsArray.length}"></progress>`;
  };

  var advanceProgressbar = function() {
    UIkit.util.ready(function () {
      try {
        var bar = document.getElementById('js-progressbar');
        bar.value += 1; 
      } catch (error) {
        
      }
    });
  };

  var deleteCard = async function () {

    // get deck Id from url
    var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    // get the card id
    var cardId = parseInt(document.querySelector('.hiddenCardId').value);

    var card = {
      cardId: cardId,
      deckId: deckId
    }

    // perform AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "http://localhost:3030/delete-card", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(card));

    let cardsArray = await getCards();

    if (cardsArray.length === 0) {
      // refresh div to update card count
      $("#card-count").load(window.location.href + " .card-count-container");
      // reload button text
      $(".top-button-container-outer").load(window.location.href + " .top-button-container-inner");
      // reset study container
      document.querySelector('.study-container').innerHTML = '';
    } else {
      // refresh div to update card count
      $(".card-count-container").load(window.location.href + " #card-count");
      // add success message
      successMessage("Card deleted.");
      nextCard();
    }
  }

  var saveCard = function () {
    // get deck Id from url
    var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    // get the card id
    var cardId = parseInt(document.querySelector('.hiddenCardId').value);

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
    successMessage("Card updated.");
  }

  var successMessage = function (message) {
    var successDiv = document.createElement('div');
    successDiv.classList.add('uk-alert-success');
    successDiv.classList.add('add-card-success');
    successDiv.classList.add('uk-margin-bottom');
    successDiv.setAttribute('uk-alert', '');
    successDiv.innerHTML = `<a class="uk-alert-close" uk-close></a><p>${message}</p>`
    document.querySelector('.uk-container').insertBefore(successDiv, document.querySelector('.success-container'));

    clearSuccess();
  }

  var clearSuccess = function () {
    let alert = document.querySelectorAll('div[uk-alert]')[0];
    if (alert) {
      setTimeout(function () {
        document.querySelector('.uk-alert').remove();
      }, 2000);
    }
  }

  // Card Iterator
  var cardIterator = function (currectDeck) {
    let nextIndex = 0;

    return {
      next: function () {
        return nextIndex < currectDeck.length ? {
          value: currectDeck[nextIndex++],
          done: false
        } : {
            done: true
          }
      }
    };
  }

  var resetStudyState = function () {
    studyModule.removeProgressBar();
    studyContainer.innerHTML = '';
    toggleStudyButtonState('neutral');
  }

  var createDeckIterator = function (cards) {
    return studyModule.cardIterator(studyModule.shuffle(cards));
  }

  var toggleStudyButtonState = function (state) {
    var studyButton = document.querySelector('.study-now') || document.querySelector('.exit-study');
    if (state === 'studying') {
      // disable study button and change inner text
      studyButton.innerText = "Exit Study";
      studyButton.classList.add('exit-study');
      studyButton.classList.remove('study-now');
    } else if (state === 'neutral') {
      document.querySelector('.exit-study').innerText = "Study Now";
      studyButton.classList.add('study-now');
      studyButton.classList.remove('exit-study');
    }
  }

  var initStudyState = async function () {
    // get cards array from database
    var cardsArray = await getCards();
    // create the deck iterator
    currectDeck = createDeckIterator(cardsArray);
    // toggle study button state
    toggleStudyButtonState('studying');
    // Set the first card
    nextCard();
    // init progress bar
    initializeProgressbar(cardsArray);
  }

  var setAnswerStudyState = function () {
    document.querySelector('.study-buttons').innerHTML = `
      <button class="edit-card uk-button uk-button-primary">Edit Card</button>
      <button class="next-card uk-button uk-button-primary">Next</button>
    `;
    showAnswer();
  };

  var setEditState = function () {
    document.querySelector('.study-buttons').innerHTML = `
      <button class="cancel-edit uk-button uk-button-default">Cancel</button>
      <button class="delete-card-first uk-button uk-button-danger">Delete Card</button>
      <button class="save-card uk-button uk-button-primary">Save Card</button>
    `;
    // enable quill editor
    backEditor.enable(true);
  }

  var setDeleteState = function () {
    document.querySelector('.study-buttons').innerHTML = `
    <span class="are-you-sure uk-margin-right">Are you sure?</span>
    <button class="yes-delete uk-button uk-button-danger">Yes<span class="delete-icon" uk-icon="icon: trash" style="margin-left: 8px;"></span></button>
    <button class="no-delete uk-button uk-button-secondary">No<span class="do-not-delete-icon" uk-icon="icon: close" style="margin-left: 8px;"></span></button>
    `;
  }

  var showAnswer = function () {
    document.querySelector('.card-back').style.display = 'block';
  }

  var toggleStudyState = function (state) {
    if (state === 'neutral') {
      resetStudyState();
    } else if (state === 'study') {
      initStudyState();
    } else if (state === 'answer') {
      setAnswerStudyState();
    } else if (state === 'edit') {
      setEditState();
    } else if (state === 'delete') {
      setDeleteState();
    }
  }

  // <button class="edit-card uk-button uk-button-primary">Edit Card</button>
  // <button class="cancel-edit uk-button uk-button-default">Cancel</button>
  // <button class="delete-card-first uk-button uk-button-danger">Delete Card</button>
  // <span class="are-you-sure uk-margin-right">Are you sure?</span>
  // <button class="yes-delete uk-button uk-button-danger">Yes<span class="delete-icon" uk-icon="icon: trash" style="margin-left: 8px;"></span></button>
  // <button class="no-delete uk-button uk-button-secondary">No<span class="do-not-delete-icon" uk-icon="icon: close" style="margin-left: 8px;"></span></button>
  // <button class="save-card uk-button uk-button-primary">Save Card</button>
  // <button class="next-card uk-button uk-button-primary">Next</button>

  return {
    shuffle,
    nextCard,
    cardIterator,
    saveCard,
    deleteCard,
    removeProgressBar,
    toggleStudyState,
    resetStudyState,
    advanceProgressbar
  }

}());

topButtonContainerOuter.addEventListener('click', async function (e) {
  if (e.target.classList.contains('study-now')) {
    // set study state
    studyModule.toggleStudyState('study');
  } else if (e.target.classList.contains('exit-study')) {
    studyModule.resetStudyState();
  }
});

studyContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('show-answer')) {
    studyModule.toggleStudyState('answer');
  } else if (e.target.classList.contains('yes-delete')) {
    studyModule.deleteCard();
    studyModule.nextCard();
  } else if (e.target.classList.contains('delete-icon')) {
    studyModule.deleteCard();
  } else if (e.target.classList.contains('edit-card')) {
    studyModule.toggleStudyState('edit');
  } else if (e.target.classList.contains('save-card')) {
    studyModule.saveCard();
    backEditor.enable(false);
  } else if (e.target.classList.contains('cancel-edit')) {
    studyModule.toggleStudyState('answer');
    backEditor.enable(false);
  } else if (e.target.classList.contains('delete-card-first')) {
    studyModule.toggleStudyState('delete');
  } else if (e.target.classList.contains('no-delete') || e.target.classList.contains('do-not-delete-icon')) {
    studyModule.toggleStudyState('edit');
  } else if (e.target.classList.contains('next-card')) {
    studyModule.nextCard();
    studyModule.advanceProgressbar();
  }
});