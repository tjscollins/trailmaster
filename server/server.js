require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {poiModel} = require('./db/models/poi');
var {routeModel} = require('./db/models/route');
var {trailModel} = require('./db/models/trail');
var {userModel} = require('./db/models/user');
var {authenticate} = require('./middleware/authenticate');
var {spawn} = require('child_process');

// var database = spawn('../../mongo/bin/mongod', ['--dbpath', '../../mongo-data']);

//Create our app
var app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

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
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  userModel
    .findByCredentials(body.email, body.password)
    .then((user) => {
      return user
        .generateAuthToken()
        .then((token) => {
          res
            .header('x-auth', token)
            .send(user);
        });
    })
    .catch((e) => {
      res
        .status(400)
        .send();
    });
});
app.delete('/users/me/token', authenticate, (req, res) => {
  req
    .user
    .removeToken(req.token)
    .then(() => {
      res
        .status(200)
        .send();
    }, () => {
      res
        .status(400)
        .send();
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
app.delete('/pois/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send();
  }

  poiModel
    .findByIdAndRemove(id)
    .then((point) => {
      if (!point) {
        return res
          .status(404)
          .send();
      }
      res.send(point);
    })
    .catch((e) => {
      res
        .status(400)
        .send();
    });
});
app.patch('/pois/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send();
  }

  poiModel.findByIdAndUpdate(id, {
    $set: req.body
  }, {new: true}).then((point) => {
    if (!point) {
      return res
        .status(404)
        .send();
    }

    res.send(point);
  }).catch((e) => {
    res
      .status(400)
      .send();
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

app.delete('/routes/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send();
  }

  routeModel
    .findByIdAndRemove(id)
    .then((point) => {
      if (!point) {
        return res
          .status(404)
          .send();
      }
      res.send(point);
    })
    .catch((e) => {
      res
        .status(400)
        .send();
    });
});
app.patch('/routes/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send();
  }

  routeModel.findByIdAndUpdate(id, {
    $set: req.body
  }, {new: true}).then((point) => {
    if (!point) {
      return res
        .status(404)
        .send();
    }

    res.send(point);
  }).catch((e) => {
    res
      .status(400)
      .send();
  });
});

app.get('/trails', authenticate, (req, res) => {
  trailModel
    .find({_creator: req.user._id})
    .then((trails) => {
      res.send({trails});
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
});
app.post('/trails', authenticate, (req, res) => {
  // console.log('Received newTrail:', req.body);
  var trail = new trailModel({
    list: req.body.list,
    name: req.body.name,
    desc: req.body.desc,
    date: req.body.date,
    _creator: ObjectID(req.user._id)
  });
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

app.use(express.static('public'));

app.listen(PORT, function() {
  console.log('Express server is up on port ' + PORT);
});

module.exports = {
  app
};
