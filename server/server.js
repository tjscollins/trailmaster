var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('./db/mongoose');
var {poiModel} = require('./db/models/poi');

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
app.use(express.static('public'));

app.listen(PORT, function() {
  console.log('Express server is up on port ' + PORT);
});

module.exports = {
  app
};
