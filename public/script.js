var getDeckSettings = async function () {
  var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/settings`;
  var response = await fetch(url);
  var responseData = await response.json();
  return responseData;
}

// get cards in current deck from api endpoint
var getCards = async function () {
  var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/cards`;
  var response = await fetch(url);
  var responseData = await response.json();
  return responseData;
}