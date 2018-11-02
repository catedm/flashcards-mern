var cards;
var cardsArray;
getCardsFromApi().then(data => cardsArray = data);

async function getCardsFromApi() {
  var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/cards`;
  var response = await fetch(url);
  var responseData = await response.json();
  return responseData;
}

document.addEventListener('keydown', function(e) {
  try {
    if (e.which === 13 || e.which === 32) {
      document.querySelector('.show-answer').style.display = 'none';
      document.querySelector('.card-back').style.display = 'block';
      document.querySelector('.next-card').style.display = 'inline';
    }
  } catch {};
});

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
    cards = cardIterator(cardsArray);

    document.querySelector('.study-now').innerText = "Studying...";
    document.querySelector('.study-now').disabled = true;

    // Set first card
    nextCard();
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
    document.querySelector('.cancel-edit').style.display = 'inline';
    document.querySelector('.card-back').style.display = 'block';
    back.enable(true);
  } else if (e.target.classList.contains('save-card')) {
    document.querySelector('.exit-study').style.display = 'inline';
    document.querySelector('.edit-card').style.display = 'inline';
    document.querySelector('.show-answer').style.display = 'inline';
    document.querySelector('.save-card').style.display = 'none';
    document.querySelector('.cancel-edit').style.display = 'none';
    document.querySelector('.card-back').style.display = 'none';
    back.enable(false);
  } else if (e.target.classList.contains('cancel-edit')) {
    document.querySelector('.exit-study').style.display = 'inline';
    document.querySelector('.edit-card').style.display = 'inline';
    document.querySelector('.show-answer').style.display = 'inline';
    document.querySelector('.save-card').style.display = 'none';
    document.querySelector('.cancel-edit').style.display = 'none';
    document.querySelector('.card-back').style.display = 'none';
    back.enable(false);
  } else if (e.target.classList.contains('exit-study')) {
    window.location.reload();
  } else if (e.target.classList.contains('next-card')) {
    nextCard();
  }
});


function nextCard() {
  const currentCard = cards.next().value;

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
      <button class="save-card uk-button uk-button-primary" onclick="saveCard()">Save Card</button>
      <button class="show-answer uk-button uk-button-primary">Show Answer</button>
      <button class="next-card uk-button uk-button-primary">Next</button>
    </p>
    <input class="hiddenCardId" type="hidden" value="${currentCard.id}" />
    `;


    front = new Quill('#front', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    back = new Quill('#back', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

  front.setContents(JSON.parse(currentCard.front));
  back.setContents(JSON.parse(currentCard.back));
  back.enable(false);

} else {
  // No more cards
  window.location.reload();
}
}

function saveCard() {
  // get deck Id from url
  var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
  // get the card id
  var cardId = parseInt(document.querySelector('.hiddenCardId').value);

  var card = {
    frontValue: JSON.stringify(front.getContents()),
    backValue: JSON.stringify(back.getContents()),
    cardId: cardId,
    deckId: deckId
  }

  // perform AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://localhost:3030/save-card", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(card));

  // add success message
  saveCardSuccess();
}

function saveCardSuccess() {
  var successDiv = document.createElement('div');
  successDiv.classList.add('uk-alert-success');
  successDiv.classList.add('add-card-success');
  successDiv.classList.add('uk-margin-bottom');
  successDiv.setAttribute('uk-alert', '');
  successDiv.innerHTML = `<a class="uk-alert-close" uk-close></a><p>Card Updated</p>`
  document.querySelector('.uk-container').insertBefore(successDiv, document.querySelector('.success-container'));

  clearSuccess();
}

// Card Iterator
function cardIterator(cards) {
  let nextIndex = 0;

  return {
    next: function() {
      return nextIndex < cards.length ? {
        value: cards[nextIndex++],
        done: false
      } : {
        done: true
      }
    }
  };
}
