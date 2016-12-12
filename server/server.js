var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('./db/mongoose');
var {poiModel} = require('./db/models/poi');
var {routeModel} = require('./db/models/route');
var {trailModel} = require('./db/models/trail');

//Create our app
const PORT = process.env.PORT || 3000;
// console.log(process.versions);

var app = express();

app.use(bodyParser.json());

app.post('/pois', (req, res) => {
  var poi = new poiModel(req.body);
  poi
    .save()
    .then((doc) => {
      res.send(doc);
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});
app.get('/pois', (req, res) => {
  poiModel
    .find()
    .then((pois) => {
      res.send({pois});
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});

app.post('/routes', (req, res) => {
  var route = new routeModel(req.body);
  route
    .save()
    .then((doc) => {
      res.send(doc);
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});
app.get('/routes', (req, res) => {
  routeModel
    .find()
    .then((routes) => {
      res.send({routes});
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});

app.post('/trails', (req, res) => {
  var trail = new trailModel(req.body);
  trail
    .save()
    .then((doc) => {
      res.send(doc);
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});
app.get('/trails', (req, res) => {
  trailModel
    .find()
    .then((trails) => {
      res.send({trails});
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});

app.use(express.static('public'));

app.listen(PORT, function() {
  console.log('Express server is up on port ' + PORT);
});

module.exports = {
  app
};
