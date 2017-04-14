require('./server/config/config');

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const routes = require('./server/routes/index');

const PORT = process.env.PORT || 3000;

//Create our app
const app = express();
app.use(bodyParser.json());
app.use(compression());
routes(app);
app.use(express.static('public'));
app.listen(PORT);

module.exports = {
  app
};
