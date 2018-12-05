const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const database = require('./config/database');
const app = express();


// mongoose.connect('mongodb://localhost/flashcard-app')
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch(err => console.log('Could not connect to MongoDB.', err));

mongoose.connect(database.url);

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

// PORT environment variable
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
