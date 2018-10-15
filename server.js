const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs  = require('express-handlebars');
const app = express();

// Routes
const index = require('./controllers/index');

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
app.use('/', index);

// PORT environment variable
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
