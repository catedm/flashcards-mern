var cards;
var cardsArray;
getCardsFromApi().then(data => cardsArray = data);

async function getCardsFromApi() {
  var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/cards`;
  var response = await fetch(url);
  var responseData = await response.json();
  return responseData;
}

document.querySelector('.browse-cards').addEventListener('click', function() {
  var container = document.querySelector('.all-cards-table-container');
  var html = ``;

  cardsArray.forEach(function(card) {
    html += `<tr class="card-row"><td>${JSON.parse(card.front).ops[0].insert.trim()}</td><td>${card.id}</td></tr>`;
  });

  document.querySelector('.all-cards-table-body').innerHTML = html;
});

document.querySelector('.all-cards-table-body').addEventListener('click', function(e) {
  // get the id of the card selected
  var id = parseInt(e.target.parentNode.firstElementChild.nextElementSibling.innerText);
  // pick selected card from the deck
  var card = cardsArray.find(card => card.id === id);

  editCardTemplate(card.front, card.back);
});


// Template for adding cards
function editCardTemplate(front, back) {
  var container = document.querySelector('.all-cards-edit-card-container');

  var template = `
    <div class="uk-grid-collapse uk-margin-bottom" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <h4>Front</h4>
          <!-- Create the editor container -->
          <div id="front-editor-all-cards">
          </div>
        </div>
      </div>
    </div>
    <div class="uk-grid-collapse" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <h4>Back</h4>
          <!-- Create the editor container -->
          <div id="back-editor-all-cards">
          </div>
        </div>
      </div>
    </div>
    <input type="hidden" name="frontValue" value="">
    <input type="hidden" name="backValue" value="">
    <input type="hidden" name="deckId" value="">
    <p class="uk-text-right uk-margin-remove-bottom">
      <button class="add-card-cancel uk-button uk-button-default uk-modal-close" type="button">Close</button>
      <input class="add-card-submit uk-button uk-button-primary" type="button" value="Submit" onclick="addCard()"/>
    </p>
  `;

  container.innerHTML = template;

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

function frontUpdate(delta) {
  // try / catch because the selector is added dynamically
  try {
    document.querySelector("input[name='frontValue']").value = JSON.stringify(frontEditor.getContents());
    return frontEditor.getContents();
  } catch (err) { }
}

function backUpdate(delta) {
  // try / catch because the selector is added dynamically
  try {
    document.querySelector("input[name='backValue']").value = JSON.stringify(backEditor.getContents());
    return backEditor.getContents();
  } catch (err) { }
}
