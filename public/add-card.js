document.querySelector('.add-card').addEventListener('click', function(e) {
  var container = document.querySelector('.add-card-form-container');
  var template = `
  <form class="add-card-form" action="/add-card" method="POST">
    <div class="uk-grid-collapse uk-margin-bottom" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <h4>Front</h4>
          <!-- Create the toolbar container -->
          <div id="front-toolbar">
            <button class="ql-bold">Bold</button>
            <button class="ql-italic">Italic</button>
          </div>

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
          <!-- Create the toolbar container -->
          <div id="back-toolbar">
            <button class="ql-bold">Bold</button>
            <button class="ql-italic">Italic</button>
          </div>

          <!-- Create the editor container -->
          <div id="back-editor">
          </div>
        </div>
      </div>
    </div>
    <p class="uk-text-right">
      <button class="add-deck-cancel uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
      <button class="add-deck-submit uk-button uk-button-primary" type="submit">Add Card</button>
    </p>
  </form>
  `;

  container.innerHTML = template;
  
  e.preventDefault();
});
