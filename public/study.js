// initialize front editor and back editor variables in global scope
var frontEditor;
var backEditor;
// this variable represents the deck while someone is studying
var currectDeck;

async function getCards() {
  var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/cards`;
  var response = await fetch(url);
  var responseData = await response.json();
  return responseData;
}

function shuffle(array) {
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


document.querySelector('.top-button-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('study-now')) {
    // get the cards from the database
    getCards().then(cardsArray => {
      currectDeck = cardIterator(shuffle(cardsArray));

      document.querySelector('.study-now').innerText = "Studying...";
      document.querySelector('.study-now').disabled = true;

      // Set first card
      nextCard();
    });
  }
});

document.querySelector('.study-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('show-answer')) {
    document.querySelector('.show-answer').style.display = 'none';
    document.querySelector('.card-back').style.display = 'block';
    document.querySelector('.next-card').style.display = 'inline';
  } else if (e.target.classList.contains('edit-card')) {
    document.querySelector('.next-card').style.display = 'none';
    document.querySelector('.exit-study').style.display = 'none';
    document.querySelector('.edit-card').style.display = 'none';
    document.querySelector('.show-answer').style.display = 'none';
    document.querySelector('.save-card').style.display = 'inline';
    document.querySelector('.delete-card-first').style.display = 'inline';
    document.querySelector('.cancel-edit').style.display = 'inline';
    document.querySelector('.card-back').style.display = 'block';
    backEditor.enable(true);
  } else if (e.target.classList.contains('save-card')) {
    document.querySelector('.exit-study').style.display = 'inline';
    document.querySelector('.edit-card').style.display = 'inline';
    document.querySelector('.show-answer').style.display = 'inline';
    document.querySelector('.save-card').style.display = 'none';
    document.querySelector('.delete-card-first').style.display = 'none';
    document.querySelector('.cancel-edit').style.display = 'none';
    document.querySelector('.card-back').style.display = 'none';
    backEditor.enable(false);
  } else if (e.target.classList.contains('cancel-edit')) {
    document.querySelector('.exit-study').style.display = 'inline';
    document.querySelector('.edit-card').style.display = 'inline';
    document.querySelector('.show-answer').style.display = 'inline';
    document.querySelector('.save-card').style.display = 'none';
    document.querySelector('.cancel-edit').style.display = 'none';
    document.querySelector('.card-back').style.display = 'none';
    document.querySelector('.delete-card-first').style.display = 'none';
    document.querySelector('.are-you-sure').style.display = 'none';
    backEditor.enable(false);
  } else if (e.target.classList.contains('exit-study')) {
    this.innerHTML = '';
    document.querySelector('.study-now').innerText = "Study Now";
    document.querySelector('.study-now').disabled = false;
  } else if (e.target.classList.contains('delete-card-first')) {
    document.querySelector('.delete-card-first').style.display = 'none';
    document.querySelector('.save-card').style.display = 'none';
    document.querySelector('.cancel-edit').style.display = 'none';
    document.querySelector('.are-you-sure').style.display = 'inline';
    document.querySelector('.yes-delete').style.display = 'inline';
    document.querySelector('.no-delete').style.display = 'inline';
  } else if (e.target.classList.contains('no-delete') || e.target.classList.contains('do-not-delete-icon')) {
    document.querySelector('.yes-delete').style.display = 'none';
    document.querySelector('.no-delete').style.display = 'none';
    document.querySelector('.are-you-sure').style.display = 'none';
    document.querySelector('.delete-card-first').style.display = 'inline';
    document.querySelector('.save-card').style.display = 'inline';
    document.querySelector('.cancel-edit').style.display = 'inline';
  } else if (e.target.classList.contains('next-card')) {
    nextCard();
  }
});


function nextCard() {
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
    <p class="uk-text-right">
      <button class="exit-study uk-button uk-button-default">Exit Study</button>
      <button class="edit-card uk-button uk-button-primary">Edit Card</button>
      <button class="cancel-edit uk-button uk-button-default">Cancel</button>
      <button class="delete-card-first uk-button uk-button-danger">Delete Card</button>
      <span class="are-you-sure uk-margin-right">Are you sure?</span>
      <button class="yes-delete uk-button uk-button-danger" onclick="deleteCard()">Yes<span class="delete-icon" uk-icon="icon: check" style="margin-left: 8px;"></span></button>
      <button class="no-delete uk-button uk-button-secondary">No<span class="do-not-delete-icon" uk-icon="icon: close" style="margin-left: 8px;"></span></button>
      <button class="save-card uk-button uk-button-primary" onclick="saveCard()">Save Card</button>
      <button class="show-answer uk-button uk-button-primary">Show Answer</button>
      <button class="next-card uk-button uk-button-primary">Next</button>
    </p>
    <p class="uk-text-right">
    <input class="hiddenCardId" type="hidden" value="${currentCard.id}" />
    `;

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
  document.querySelector('.study-now').innerText = "Study Now";
  document.querySelector('.study-now').disabled = false;
  successMessage("You finished this deck!");
}
}

function deleteCard() {

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


    getCards().then(cardsArray => {
      if (cardsArray.length === 0) {
        // refresh div to update card count
        $("#card-count").load(window.location.href + " .card-count-container");
        // reload button text
        $(".top-button-container").load(window.location.href + " .study-now");
        // reset study container
        document.querySelector('.study-container').innerHTML = '';
      } else {
        // refresh div to update card count
        $(".card-count-container").load(window.location.href + " #card-count");
        // add success message
        successMessage("Card deleted.");
        nextCard();
      }
    });

}

function saveCard() {
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

function successMessage(message) {
  var successDiv = document.createElement('div');
  successDiv.classList.add('uk-alert-success');
  successDiv.classList.add('add-card-success');
  successDiv.classList.add('uk-margin-bottom');
  successDiv.setAttribute('uk-alert', '');
  successDiv.innerHTML = `<a class="uk-alert-close" uk-close></a><p>${message}</p>`
  document.querySelector('.uk-container').insertBefore(successDiv, document.querySelector('.success-container'));

  clearSuccess();
}

// Card Iterator
function cardIterator(currectDeck) {
  let nextIndex = 0;

  return {
    next: function() {
      return nextIndex < currectDeck.length ? {
        value: currectDeck[nextIndex++],
        done: false
      } : {
        done: true
      }
    }
  };
}
