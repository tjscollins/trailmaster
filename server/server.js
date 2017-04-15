// require('./config/config');
import './config/config';
import mongoose from './db/mongoose';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

import routes from './routes/index';

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
