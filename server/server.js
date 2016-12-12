var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var mongoose = require('./db/mongoose');
var {poiModel} = require('./db/models/poi');
var {routeModel} = require('./db/models/route');
var {trailModel} = require('./db/models/trail');
var {userModel} = require('./db/models/user');

// var passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy;

//Create our app
const PORT = process.env.PORT || 3000;
// console.log(process.versions);

var app = express();

app.use(bodyParser.json());

// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }));
//
// passport.use(new LocalStrategy(function(username, password, done) {
//   User
//     .findOne({
//       username: username
//     }, function(err, user) {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, {message: 'Incorrect username.'});
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, {message: 'Incorrect password.'});
//       }
//       return done(null, user);
//     });
// }));

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new userModel(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res
        .header('x-auth', token)
        .send(user);
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});

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
