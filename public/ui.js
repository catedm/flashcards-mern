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

const addDeckSubmit = document.querySelector('.add-deck-submit');
const addDeckSubmitAlert = document.querySelector('.add-deck-submit-alert');
const addDeckCancel = document.querySelector('.add-deck-cancel');
const addDeckInput = document.querySelector('.add-deck-input');
const addDeckModalBackground = document.querySelector('#add-deck-modal');
const addDeckModal = document.querySelector('.add-deck-modal');
const renameDeckInput = document.querySelector('.rename-deck-input');
const renameDeckSubmit = document.querySelector('.rename-deck-submit');
const renameDeckLink = document.querySelector('.rename-deck');
const renameDeckModal = document.querySelector('.rename-deck-modal');
const renameDeckIdInput = document.querySelector('.deck-id');
const deckTableBody = document.querySelector('.deck-table-body');
const deckTable = document.querySelector('.deck-table');
const deckSuccessContainer = document.querySelector('.deck-success-container');
const navBar = document.querySelector('.uk-navbar-container');

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
