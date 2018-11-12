// declare outside of the event listener so that we have access to the editors in the global scope
var frontEditor;
var backEditor;
var frontEditorContents;
var backEditorContents;

// main menu add card listener
document.querySelector('.add-card').addEventListener('click', function(e) {
  addCardTemplate();
  e.preventDefault();
});

// IF there are ZERO cards in the deck, add listener for ADD CARD button
document.querySelector('.top-button-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('add-card')) {
    addCardTemplate();
    e.preventDefault();
  }
});

// Template for adding cards
function addCardTemplate() {
  var container = document.querySelector('.add-card-form');

  var template = `
    <div class="uk-grid-collapse uk-margin-bottom" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <h4>Front</h4>
          <!-- Create the editor container -->
          <div id="front-editor">
          </div>
        </div>
      </div>
    </div>
    <div class="uk-grid-collapse" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <h4>Back</h4>
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
  });

  frontEditor.on('editor-change', frontUpdate);
  backEditor.on('editor-change', backUpdate);
}

function addCard() {
  // get deck Id from url
  var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

  // make card to send to route handler
  var card = {
    frontValue: document.querySelector("input[name='frontValue']").value,
    backValue: document.querySelector("input[name='backValue']").value,
    deckId: deckId
  }

  // send XHR request to database
  sendXHRRequest(card);

  // reset form
  resetAddCardForm();

  // refresh div to update card count
  $("#card-count").load(window.location.href + " #card-count");
  // reload button text
  $(".top-button-container").load(window.location.href + " .top-button-container");

  // add success message
  addCardSuccess();

}

function sendXHRRequest(card) {
  // perform AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3030/add-card", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(card));
}

function resetAddCardForm() {
  frontEditor.setContents([]);
  backEditor.setContents([]);
}

function addCardSuccess() {
  var successDiv = document.createElement('div');
  successDiv.classList.add('uk-alert-success');
  successDiv.classList.add('add-card-success');
  successDiv.classList.add('uk-margin-bottom');
  successDiv.setAttribute('uk-alert', '');
  successDiv.innerHTML = `<a class="uk-alert-close" uk-close></a><p>Card Added</p>`;
  document.querySelector('.add-card-form-container').insertBefore(successDiv, document.querySelector('.add-card-form'));

  clearSuccess();
}

function clearSuccess() {
  setTimeout(function() {
    document.querySelector('.add-card-success').remove();
  }, 2000);
};

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
