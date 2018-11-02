// class UI {
//   constructor() {
//     this.addDeckSubmit = document.querySelector('.add-deck-submit');
//     this.addDeckCancel = document.querySelector('.add-deck-cancel');
//     this.addDeckInput = document.querySelector('.add-deck-input');
//     this.renameDeckInput = document.querySelector('.rename-deck-input');
//     this.renameDeckSubmit = document.querySelector('.rename-deck-submit');
//     this.renameDeckLink = document.querySelector('.rename-deck');
//     this.renameDeckModal = document.querySelector('.rename-deck-modal');
//     this.renameDeckIdInput = document.querySelector('.deck-id');
//     this.addDeckModal = document.querySelector('.add-deck-modal');
//     this.deckTableBody = document.querySelector('.deck-table-body');
//     this.deckTable = document.querySelector('.deck-table');
//     this.deckSuccessContainer = document.querySelector('.deck-success-container');
//     this.navBar = document.querySelector('.uk-navbar-container');
//   }
//
  // showAlert(message, className) {
  //   var currentAlert = document.querySelector('.uk-alert');
  //   if (currentAlert) {
  //     return
  //   };
  //
  //   // build template
  //   var alertTemplate = `<div class="${className} uk-margin" uk-alert>
  //                 <a class="uk-alert-close" uk-close></a>
  //                 <p>${message}</p>
  //               </div>`;
  //
  //   // Create div
  //   var alertTemplateContainer = document.createElement('div');
  //   // Add margin class
  //   alertTemplateContainer.className = 'uk-margin';
  //   // Set div HTML
  //   alertTemplateContainer.innerHTML = alertTemplate;
  //   // Add div to DOM
  //   if (className.includes('primary')) {
  //     if (message.includes('enter')) {
  //       this.addDeckInput.parentElement.append(alertTemplateContainer);
  //     } else if (message.includes('rename')) {
  //       this.renameDeckInput.parentElement.append(alertTemplateContainer);
  //     }
  //   } if (className.includes('success')) {
  //     this.deckTable.insertAdjacentElement('beforebegin', alertTemplateContainer);
  //   }
  //
  //   // Timeout
  //   setTimeout(() => {
  //     this.clearAlert();
  //   }, 2500);
  // }
  //
  // clearAlert() {
  //   var currentAlert = document.querySelector('.uk-alert');
  //
  //   if (currentAlert) {
  //     currentAlert.remove();
  //   }
  // }
//
//   getDecks(decks) {
//     var html = ``;
//
//     decks.forEach(deck => {
//       html += `<tr class="deck-row-${deck.id}" data-id="${deck.id}">
//                   <td class="deck-title-${deck.id}"><a href="/${deck.id}">${deck.title}</a></td>
//                   <td>${deck.cards.length}</td>
//                   <td>
//                   <div class="uk-inline">
//                     <button class="uk-button uk-button-default" type="button"><span uk-icon="cog"></span></button>
//                     <div uk-dropdown="pos: bottom-justify; mode: click" class="uk-padding-small">
//                         <ul class="uk-nav uk-dropdown-nav">
//                             <li><span class="uk-margin-small-right" uk-icon="icon: pencil"></span><a href="#rename-deck-modal" class="rename-deck" uk-toggle>Rename</a></li>
//                             <li><span class="uk-margin-small-right" uk-icon="icon: trash"></span><a id="js-modal-confirm" class="delete-deck" href="#">Delete</a></li>
//                         </ul>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>`
//     });
//
//   var tableRef = this.deckTableBody;
//   tableRef.innerHTML = html;
//   this.addDeckInput.value = '';
//   UIkit.modal(this.addDeckModal).hide();
//
//   }
//
//   clearAddDeckInput() {
//     this.addDeckInput.value = '';
//   }
//
//   clearRenameDeckInput() {
//     this.renameDeckInput.value = '';
//   }
//
//   setRenameDeckInput(name) {
//     // Set the input to the current name
//     this.renameDeckInput.value = name;
//   }
//
//   renameDeck(deckIdAndName) {
//     var deckTitleCell = document.querySelector(`.deck-title-${deckIdAndName.id}`);
//     deckTitleCell.innerHTML = '';
//     deckTitleCell.innerHTML = `<a href="/${deckIdAndName.id}">${deckIdAndName.title}</a>`;
//     UIkit.modal(this.renameDeckModal).hide();
//   }
//
//   removeDeck(id) {
//     document.querySelector(`.deck-row-${id}`).remove();
//   }
// }
//
// export const UICtrl = new UI();

var addDeckSubmit = document.querySelector('.add-deck-submit');
var addDeckSubmitAlert = document.querySelector('.add-deck-submit-alert');
var addDeckCancel = document.querySelector('.add-deck-cancel');
var addDeckInput = document.querySelector('.add-deck-input');
var addDeckModalBackground = document.querySelector('#add-deck-modal');
var addDeckModal = document.querySelector('.add-deck-modal');
var renameDeckInput = document.querySelector('.rename-deck-input');
var renameDeckSubmit = document.querySelector('.rename-deck-submit');
var renameDeckLink = document.querySelector('.rename-deck');
var renameDeckModal = document.querySelector('.rename-deck-modal');
var renameDeckIdInput = document.querySelector('.rename-deck-id');
var renameDeckSubmitAlert = document.querySelector('.rename-deck-submit-alert');
var deleteDeckIdInput = document.querySelector('.delete-deck-id');
var deckTableBody = document.querySelector('.deck-table-body');
var deckTable = document.querySelector('.deck-table');
var deckSuccessContainer = document.querySelector('.deck-success-container');
var navBar = document.querySelector('.uk-navbar-container');

function showAlert(message, className) {
  var currentAlert = document.querySelector('.uk-alert');
  if (currentAlert) {
    return
  };

  // build template
  var alertTemplate = `<div class="${className} uk-margin" uk-alert>
                <a class="uk-alert-close" uk-close></a>
                <p>${message}</p>
              </div>`;

  // Create div
  var alertTemplateContainer = document.createElement('div');
  // Add margin class
  alertTemplateContainer.className = 'uk-margin';
  // Set div HTML
  alertTemplateContainer.innerHTML = alertTemplate;
  // Add div to DOM
  if (className.includes('primary')) {
    if (message.includes('enter')) {
      addDeckInput.parentElement.append(alertTemplateContainer);
    } else if (message.includes('rename')) {
      renameDeckInput.parentElement.append(alertTemplateContainer);
    }
  } if (className.includes('success')) {
    deckTable.insertAdjacentElement('beforebegin', alertTemplateContainer);
  }

  // Timeout
  setTimeout(() => {
    this.clearAlert();
  }, 2500);
}

function clearAlert() {
  var currentAlert = document.querySelector('.uk-alert');

  if (currentAlert) {
    currentAlert.remove();
  }
}

addDeckInput.addEventListener('keyup', function(e) {
  if (this.value.trim().length > 0) {
    addDeckSubmit.disabled = false;
    addDeckSubmitAlert.style.display = 'none';
  }
  else {
    addDeckSubmit.disabled = true;
    addDeckSubmitAlert.style.display = 'block';
  }
});

document.addEventListener('click', function(e) {
  if (e.target === addDeckModalBackground) {
    addDeckInput.value = '';
    addDeckSubmitAlert.style.display = 'block';
    addDeckSubmit.disabled = true;
  }
});

addDeckSubmitAlert.addEventListener('click', function(e) {
  showAlert('Please enter a deck name.', 'uk-alert-primary');
});

addDeckCancel.addEventListener('click', function(e) {
  addDeckSubmit.disabled = true;
  addDeckSubmitAlert.style.display = 'block';
  addDeckInput.value = '';
});

renameDeckSubmitAlert.addEventListener('click', function(e) {
  showAlert('Please rename your deck.', 'uk-alert-primary');
});

renameDeckInput.addEventListener('keyup', function(e) {
  if (this.value.trim().length === 0) {
    renameDeckSubmit.disabled = true;
    renameDeckSubmitAlert.style.display = 'block';
  } else if (this.value.trim().length > 0) {
    renameDeckSubmit.disabled = false;
    renameDeckSubmitAlert.style.display = 'none';
  }
});

deckTableBody.addEventListener('click', deckOptionsLinkClick);

function deckOptionsLinkClick(e) {
  // this guard clause prevents an error when clicking on the SVG icon
  // in the options button
  if
  (e.target.tagName === 'svg') {
    return;
  }
  else if
  (e.target.className.includes('rename')) {
    // Make sure rename submit button is active
    renameDeckSubmit.disabled = false;
    renameDeckSubmitAlert.style.display = 'none';
    // Get and set current deck name and id in Rename Deck modal
    var name = e.target.closest('tr').firstElementChild.textContent;
    var id = e.target.closest('tr').dataset.id;
    // Set the name in the ui
    renameDeckInput.value = name;
    // Set the id to the hidden input field in the rename modal
    // We need this in the rename deck modal in order to access the deck in the data structure using the id
    renameDeckIdInput.value = id;
  }
  else if
  (e.target.className.includes('delete')) {
    // Set the id to the hidden input field in the rename modal
    // We need this in the rename deck modal in order to access the deck in the data structure using the id
    var id = e.target.closest('tr').dataset.id;
    deleteDeckIdInput.value = id;
  }
}
