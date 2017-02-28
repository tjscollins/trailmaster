require('./config/config');

// const fs = require('fs'); const https = require('https');
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
const app = express();

app.use(bodyParser.json());

app.get('*', function(req, res, next) {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect('https://' + req.host + req.url);
  } else {
    next();/* Continue to other routes if we're not redirecting */
  }
});

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  body.email = body.email.trim().toLowerCase();
  let user = new userModel(body);
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
  let body = _.pick(req.body, ['email', 'password']);
  bcrypt
    .hash(body.password, 10)
    .then((hash) => {
      userModel.update({
        email: body.email.trim().toLowerCase()
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
  let body = _.pick(req.body, ['email', 'password']);

  userModel
    .findByCredentials(body.email.trim().toLowerCase(), body.password)
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
  let {email} = _.pick(req.body, ['email']);
  email = email.trim().toLowerCase();
  let url = 'http://' + req.get('host') + '/users/reset';
  userModel
    .resetPassword(email)
    .then((reqID) => {
      let auth = {
        auth: {
          api_key: 'key-52c28f88d00577e50d1d461a6e5dec02',
          domain: 'mg.tjscollins.me',
        }
      };
      let nodemailerMailgun = nodemailer.createTransport(mg(auth));
      let message = {
        from: '"Trailmaster Admin" <tjscollins@gmail.com>',
        to: `${email}`,
        subject: 'Password Recovery',
        text: 'Fix Your Password Here',
        html: `<p>The following is a single-use link to reset your password.</p><p>It will only work for 24 hours</p><a href=\"${url}/${reqID}-${encodeURI(email)}\">Reset Password</a>`,
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
  let {reqID, email} = req.params;
  let toRemove = [],
    toUse = -1;
  let invalid = true;
  userModel
    .find({email})
    .then((user) => {
      if (!user.length) {
        return Promise.reject('No such user');
      }
      let remainingRequests = user[0]
        .resetRequests
        .filter((request, i) => {
          let currentTime = new Date().getTime();
          let interval = currentTime - request.time;
          if (bcrypt.compare(reqID, request.reqID)) {
            invalid = false;
            toUse = i;
            res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-che' +
                'ck=0');
            res.sendFile(path.join(__dirname, '/../restricted/password-reset.html'));
          }
          return toUse !== i && interval > 0 && interval < 86400000;
        });
      if (invalid) {
        res.sendStatus(403);
      }
      userModel.update({
        email: email
      }, {resetRequests: remainingRequests}).then((person) => {
        // console.log(user);
      });
    });
});

app.get('/pois', (req, res) => {
  let {query} = req;
  if (query.hasOwnProperty('lat') && query.hasOwnProperty('lng') && query.hasOwnProperty('dist')) {
    let {lat, lng, dist} = query;
    let lngDegPerMile = Math.cos(lat*Math.PI/180)/69;
    let latDegPerMile = 1/69;

    console.log('Sending pois within degrees', dist, lng, parseFloat(lng), dist*lngDegPerMile, lat, parseFloat(lat), dist*latDegPerMile);
    poiModel.find({
      'geometry.coordinates.0': {
        $lt: parseFloat(lng) + dist*lngDegPerMile,
        $gt: parseFloat(lng) - dist*lngDegPerMile,
      },
      'geometry.coordinates.1': {
        $lt: parseFloat(lat) + dist*latDegPerMile,
        $gt: parseFloat(lat) - dist*latDegPerMile
      }
    }).then((pois) => {
      res.send({pois});
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
  } else {
    poiModel
      .find()
      .then((pois) => {
        res.send({pois});
      }, (e) => {
        res
          .status(400)
          .send(e);
      });
  }
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
    .markForDelete(id)
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
        .send(e);
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
  }, {
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  }).then((point) => {
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
  let {query} = req;
  if (query.hasOwnProperty('lat') && query.hasOwnProperty('lng')) {
    let {lat, lng} = query;
    routeModel.find({
      'geometry.coordinates.0.0': {
        $lt: parseInt(lng) + 1,
        $gt: parseInt(lng) - 1
      },
      'geometry.coordinates.0.1': {
        $lt: parseInt(lat) + 1,
        $gt: parseInt(lat) - 1
      }
    }).then((routes) => {
      res.send({routes});
    }, (e) => {
      res
        .status(400)
        .send(e);
    });
  }else {
    routeModel
      .find()
      .then((routes) => {
        res.send({routes});
      }, (e) => {
        res
          .status(400)
          .send(e);
      });
  }

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
    .markForDelete(id)
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
  }, {
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  }).then((point) => {
    if (!point) {
      return res
        .status(404)
        .send();
    }

    res.send(point);
  }).catch((e) => {
    // console.log('Bad PATCH request: ', req.body);
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
  let trail = new trailModel({
    list: req.body.list,
    name: req.body.name,
    desc: req.body.desc,
    date: req.body.date,
    _creator: ObjectID(req.user._id),
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
app.delete('/trails/:id', (req, res) => {
  let id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res
      .status(404)
      .send();
  }

  trailModel
    .findByIdAndRemove(id)
    .then((trail) => {
      if (!trail) {
        return res
          .status(404)
          .send();
      }
      res.send(trail);
    })
    .catch((e) => {
      res
        .status(400)
        .send();
    });
});

app.use(express.static('public'));

app.listen(PORT);

module.exports = {
  app
};
