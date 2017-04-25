// require('./config/config');
import 'babel-polyfill';
import './config/config';
import mongoose from './db/mongoose';

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

import routes from './routes/index';

//Create our app
const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(compression());
routes(app, mongoose);
app.use(express.static('public'));
mongoose.connection.once('open', function() {
  // Wait for the database connection to be established, then start the app.
  app.listen(process.env.PORT);
});

module.exports = {
  app
};
