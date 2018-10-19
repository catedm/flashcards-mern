const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/flashcard-app')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB.', err));

// Routes
const decks = require('./routes/decks');

const sessionStore = new session.MemoryStore;


app.use(express.json());

app.use(cookieParser('secret'));
app.use(session({
  secret: 'secret',
  store: sessionStore,
  resave: 'true',
  saveUninitialized: true,
  cookie: { maxAge: 60000 }}
));
app.use(flash());

// Set view root and view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views engine', 'handlebars');

// Set public assets to be served
app.use(express.static('public'));

// enable put and delete requests from forms
app.use(methodOverride('_method'));
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

// Set routes
app.use('/', decks);

// PORT environment variable
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
