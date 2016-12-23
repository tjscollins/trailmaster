require('./config/config');

const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const bcrypt = require('bcryptjs');
const path = require('path');

const {mongoose} = require('./db/mongoose');
const {poiModel} = require('./db/models/poi');
const {routeModel} = require('./db/models/route');
const {trailModel} = require('./db/models/trail');
const {userModel} = require('./db/models/user');
const {authenticate} = require('./middleware/authenticate');

const PORT = process.env.PORT || 3000;

//Create our app
var app = express();

app.use(bodyParser.json());

app.get('*', function(req, res, next) {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect('https://' + req.host + req.url)
  } else {
    next()/* Continue to other routes if we're not redirecting */
  }
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
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

app.patch('/users/password', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  bcrypt
    .hash(body.password, 10)
    .then(hash => {
      userModel.update({
        email: body.email
      }, {
        password: hash
      }, (err, raw) => {
        if (err)
          console.log('Error patching password', err);
        }
      );
    })
    .then(() => {
      res.redirect(303, '/');
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
app.post('/users/reset', (req, res) => {
  var data = _.pick(req.body, ['email']);
  var url = 'http://' + req.get('host') + '/users/reset';
  userModel
    .resetPassword(data.email)
    .then((reqID) => {
      var auth = {
        auth: {
          api_key: 'key-52c28f88d00577e50d1d461a6e5dec02',
          domain: 'mg.tjscollins.me'
        }
      };
      var nodemailerMailgun = nodemailer.createTransport(mg(auth));
      var message = {
        from: '"Trailmaster Admin" <tjscollins@gmail.com>',
        to: `${data.email}`,
        subject: 'Password Recovery',
        text: 'Fix Your Password Here',
        html: `<p>The following is a single-use link to reset your password.</p><p>It will only work for 24 hours</p><a href=\"${url}/${reqID}-${encodeURI(data.email)}\">Reset Password</a>`
      };
      nodemailerMailgun.sendMail(message, function(err, info) {
        if (err) {
          console.log('Error: ' + err);
        } else {
          // console.log('Response: ' + info);
        }
      });
      res
        .status(200)
        .send();
    })
    .catch((e) => {
      res
        .status(400)
        .send(e);
    });
});
app.get('/users/reset/:reqID-:email', (req, res) => {
  var {reqID, email} = req.params;
  var toRemove = [],
    toUse = -1;
  var invalid = true;
  userModel
    .find({email})
    .then((user) => {
      if (!user.length) {
        return Promise.reject('No such user');
      }
      var remainingRequests = user[0]
        .resetRequests
        .filter((request, i) => {
          var currentTime = new Date().getTime();
          var interval = currentTime - request.time;
          if (bcrypt.compare(reqID, request.reqID)) {
            invalid = false;
            toUse = i;
            res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.sendFile(path.join(__dirname, '/../restricted/password-reset.html'));
          }
          return toUse !== i && interval > 0 && interval < 86400000;
        });
      if (invalid) {
        res.sendStatus(403);
      }
      userModel.update({
        email: email
      }, {resetRequests: remainingRequests}).then((user) => {
        // console.log(user);
      });
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

app.listen(PORT);

module.exports = {
  app
};
