require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const {mongoose} = require('./server/db/mongoose');

const routes = require('./server/routes/index');

const PORT = process.env.PORT || 3000;

//Create our app
const app = express();
app.use(bodyParser.json());
app.use(compression());
routes(app, mongoose);
app.use(express.static('public'));
mongoose.connection.once('open', function() {
  // Wait for the database connection to establish, then start the app.
  app.listen(PORT);
});

module.exports = {
  app
};
