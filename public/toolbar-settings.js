var toolbarOptionsCopy = [];
var toolbarSettingsEditor;
var checkboxesContainer = document.querySelector('.checkboxes-container');
var allOptionInputs = Array.from(document.querySelectorAll('.uk-checkbox'));
var allOptionValues = allOptionInputs.map(input => {
  return input.value;
});

function selectedOptionFromDOM(option) {
  if (option === 'header-1') {
    return document.querySelector(`button[value="1"]`);
  } else if (option === 'header-2') {
    return document.querySelector(`button[value="2"]`);
  } else if (option === 'list-ordered') {
    return document.querySelector(`button[value="ordered"]`);
  } else if (option === 'list-bullet') {
    return document.querySelector(`button[value="bullet"]`);
  } else if (option === 'script-super') {
    return document.querySelector(`button[value="super"]`);
  } else if (option === 'script-sub') {
    return document.querySelector(`button[value="sub"]`);
  } else if (option === 'indent-+') {
    return document.querySelector(`button[value="+1"]`);
  } else if (option === 'indent--') {
    return document.querySelector(`button[value="-1"]`);
  } else if (option === 'direction-rtl') {
    return document.querySelector(`button[value="rtl"]`);
  } else if (option === 'size') {
    return document.querySelector('span.ql-size');
  } else if (option === 'header') {
    return document.querySelector('span.ql-header');
  } else if (option === 'color') {
    return document.querySelector('span.ql-color');
  } else if (option === 'background') {
    return document.querySelector('span.ql-background');
  } else if (option === 'font') {
    return document.querySelector('span.ql-font');
  } else if (option === 'align') {
    return document.querySelector('span.ql-align');
  } 
  else {
    return document.querySelector(`.ql-${option}`);
  }
}

checkboxesContainer.addEventListener('click', function(e) {
  var selectedOption = selectedOptionFromDOM(e.target.value);
  if (e.target.checked === false) {
    // if false, remove from DOM and toolbarOptionsCopy
    selectedOption.remove();
    let index = toolbarOptionsCopy.findIndex(option => {
      return option === selectedOption.classList[0].replace(/ql-/g, '');
    });
    toolbarOptionsCopy.splice(index, 1);
    setToolbarOptionsCopy();
    resetToolbar();
    sendSettingsToDatabase(); 
  } else if (e.target.checked === true) {
    // if true, add to DOM and toolbarOptionsCopy
    // add to the DOM
    toolbarOptionsCopy.push(e.target.value);
    setToolbarOptionsCopy();
    resetToolbar();
    sendSettingsToDatabase(); 
  }
});

function getIndexOfOption(selectedOption) {
  return toolbarOptionsCopy.findIndex(option => {
    return option === selectedOption.classList[0].replace(/ql-/g, '');
  });
}

// create a copy of the toolbarOptions settings in the database and save it to the toolbarOptions array
// we do this based on the checked values in the DOM that are checked based on what is stored in the settings in the database
function setToolbarOptionsCopy() {
  // reset the toolbarOptionsCopy
  toolbarOptionsCopy = [];
  allOptionInputs.forEach(option => {
    if (option.checked) {
      if (option.value.includes('-') && option.value !== 'code-block') {
        toolbarOptionsCopy.push(convertOptionToObject(option.value));
      } else if (option.value === 'size') {
        toolbarOptionsCopy.push({ 'size': ['small', false, 'large', 'huge'] });
      } else if (option.value === 'header') {
        toolbarOptionsCopy.push({ 'header': [1, 2, 3, 4, 5, 6, false] });
      } else if (option.value === 'color') {
        toolbarOptionsCopy.push({ 'color': [] });
      } else if (option.value === 'background') {
        toolbarOptionsCopy.push({ 'background': [] });
      } else if (option.value === 'font') {
        toolbarOptionsCopy.push({ 'font': [] });
      } else if (option.value === 'align') {
        toolbarOptionsCopy.push({ 'align': [] });
      } else {
        toolbarOptionsCopy.push(option.value);
      }
    }
  });
}

// select all button
// set toolbarOptionsCopy to all values
// initializeCheckboxes()
// call sendSettingsToDatabase
// call resetToolbar
function selectAllOptions() {
  toolbarOptionsCopy = [
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'clean',
    { 'header': 1 },
    { 'header': 2 },
    { 'list': 'ordered'},
    { 'list': 'bullet' },
    { 'script': 'sub'},
    { 'script': 'super' },
    { 'indent': '-1'},
    { 'indent': '+1' },
    { 'direction': 'rtl' },
    { 'size': ['small', false, 'large', 'huge'] },
    { 'header': [1, 2, 3, 4, 5, 6, false] },
    { 'color': [] },
    { 'background': [] },
    { 'font': [] },
    { 'align': [] }
 ];

  allOptionInputs.forEach(checkbox => {
    checkbox.checked = true;
  });


 sendSettingsToDatabase();
 resetToolbar();
}

// clear all options on clear all button click
function clearAllOptions() {
  toolbarOptionsCopy = [];

  allOptionInputs.forEach(checkbox => {
    checkbox.checked = false;
  });

  sendSettingsToDatabase();
  resetToolbar();
}

function convertOptionToObject(option) {
  if (option === 'indent--' || option === 'indent-+') {
    // need a special function for these
    return buildIndentObject(option);
  } else {
    let optionArray = option.split('-');
    let obj = {};
    let key = optionArray[0];
    let value = optionArray[1];
    obj[key] = value;
    return obj;
  }
}

function buildIndentObject(option) {
  return option === 'indent--' ? { 'indent': '-1'} : { 'indent': '+1'};
}

function resetToolbar() {
  document.querySelectorAll('.toolbar-options .ql-toolbar')[0].remove();
  toolbarSettingsEditor = new Quill('#toolbar-settings-editor', {
    modules: {
      syntax: true,
      toolbar: toolbarOptionsCopy
    },
    theme: 'snow'
  });
}

function initialzeCheckboxes() {
  // get the deck settings from the database on page load and add them as checked values in the DOM
  getDeckSettings().then(toolbarOptions => {
    toolbarOptions.forEach(option => {
      if (typeof(option) === 'object') {
        let objectValueForComparison = Object.values(option)[0];
        if (objectValueForComparison === "1" || objectValueForComparison === 1) {
          document.querySelector(`input[value=header-1]`).checked = true;
        } else if (objectValueForComparison === "2" || objectValueForComparison === 2) {
          document.querySelector(`input[value=header-2]`).checked = true;
        } else if (objectValueForComparison === "ordered") {
          document.querySelector(`input[value=list-ordered]`).checked = true;
        } else if (objectValueForComparison === "bullet") {
          document.querySelector(`input[value=list-bullet]`).checked = true;
        } else if (objectValueForComparison === "super") {
          document.querySelector(`input[value=script-super]`).checked = true;
        } else if (objectValueForComparison === "sub") {
          document.querySelector(`input[value=script-sub]`).checked = true;
        } else if (objectValueForComparison === "-1") {
          document.querySelector(`input[value=indent--]`).checked = true;
        } else if (objectValueForComparison === "+1") {
          document.querySelector(`input[value=indent-\\+]`).checked = true;
        } else if (objectValueForComparison === "rtl") {
          document.querySelector(`input[value=direction-rtl]`).checked = true;
        } else if (Object.keys(option)[0] === 'size') {
          document.querySelector(`input[value=size]`).checked = true;
        } else if (objectValueForComparison[0] === 1) {
          document.querySelector(`input[value=header]`).checked = true;
        } else if (Object.keys(option)[0] === 'color') {
          document.querySelector(`input[value=color]`).checked = true;
        } else if (Object.keys(option)[0] === 'background') {
          document.querySelector(`input[value=background]`).checked = true;
        } else if (Object.keys(option)[0] === 'font') {
          document.querySelector(`input[value=font]`).checked = true;
        } else if (Object.keys(option)[0] === 'align') {
          document.querySelector(`input[value=align]`).checked = true;
        }
      } else if (allOptionValues.includes(option)) {
        document.querySelector(`input[value=${option}]`).checked = true;
      }
    });
  }).then(() => {
    // need to set this after deck settings in the database have been pulled and added via getDeckSettings()
    setToolbarOptionsCopy();
  });
}

function initializeToolbar() {
  getDeckSettings().then(toolbarOptions => {
    toolbarSettingsEditor = new Quill('#toolbar-settings-editor', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });
  });
}

function sendSettingsToDatabase() {
  // get deck Id from url
  var deckId = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

  var deckIdAndSettings = {
    deckId: deckId,
    toolbarOptions: toolbarOptionsCopy
  }

  // perform AJAX request
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", "http://localhost:3030/update-toolbarsettings", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify(deckIdAndSettings));

  // success message
}

initialzeCheckboxes();
initializeToolbar();
