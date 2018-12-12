const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/user');
require('./services/passport');

const app = express();

if (app.get('env') === 'development') {
mongoose.connect(keys.mongoURI)
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

// this statement tells express that it needs to use cookies in our app
app.use(
	cookieSession({
		// this must be entered in milliseconds
		// the following is equal to 30 days in milliseconds
		maxAge: 30 * 24 * 60 * 60 * 1000,
		// load in cookie encryption from keys file
		keys: [keys.cookieKey]
	})
);
// these app.use calls are adding middleware to our application
// middleware modifies / preprocesses the incoming requests before they are sent to route handlers
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

// PORT environment variable
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
