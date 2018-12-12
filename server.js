const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const session = require("express-session");
const keys = require('./config/keys');

if (app.get('env') === 'development') {
mongoose.connect('mongodb://localhost/flashcard-app')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB.', err));
} else if (app.get('env') === 'production') {
  mongoose.connect(keys.mongoURI);
}

// Routes
const decks = require('./routes/decks');
const api = require('./routes/api');


app.use(express.json());

// Set view root and view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views engine', 'handlebars');

// Set public assets to be served
app.use(express.static('public'));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// Set routes
app.use('/', decks);
app.use('/api/decks', api);

// set user registration stuff
app.use(session({
  secret: 'asbkhdfjbsdahjkf378459hfdsaE',
  resave: true,
  saveUninitialized: false
}));

// PORT environment variable
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
