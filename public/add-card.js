// declare outside of the event listener so that we have access to the editors in the global scope
var frontEditor;
var backEditor;
var frontEditorContents;
var backEditorContents;

document.querySelector('.add-card').addEventListener('click', function(e) {
  var container = document.querySelector('.add-card-form-container');

  var template = `
  <form class="add-card-form" action="/add-card" method="POST">
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
    <p class="uk-text-right">
      <button class="add-card-cancel uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
      <button class="add-card-submit uk-button uk-button-primary" type="submit">Add Card</button>
    </p>
  </form>
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

  e.preventDefault();
});

document.querySelector('.add-card-form-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('add-card-cancel')) {
    this.innerHTML = '';
  } else if (e.target.classList.contains('add-card-submit')) {
    document.querySelector("input[name='deckId']").value = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
  }
});

function frontUpdate(delta) {
  try {
    document.querySelector("input[name='frontValue']").value = JSON.stringify(frontEditor.getContents());
    return frontEditor.getContents();
  } catch (err) { }
}

function backUpdate(delta) {
  try {
    document.querySelector("input[name='backValue']").value = JSON.stringify(backEditor.getContents());
    return backEditor.getContents();
  } catch (err) { }
}
