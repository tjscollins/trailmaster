'use strict';
/*eslint-disable require-jsdoc*/
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import {
  createIsomorphicWebpack
} from 'isomorphic-webpack';
import {
  renderToString
} from 'react-dom/server';
import webpackConfiguration from '../../webpack.config.server.js';

const PoiModel = require('../db/models/poi');
const RouteModel = require('../db/models/route');
const TrailModel = require('../db/models/trail');
const UserModel = require('../db/models/user');
const {authenticate} = require('../middleware/authenticate');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const bcrypt = require('bcryptjs');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';


module.exports = function(app, mongoose) {
  const compiler = webpack(webpackConfiguration);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: '/public',
    quiet: false,
    stats: {
      assets: false,
      chunkModules: false,
      chunks: false,
      colors: true,
      hash: false,
      timings: false,
      version: false
    }
  }));

  const {
  createCompilationPromise,
  evalBundleCode
} = createIsomorphicWebpack(webpackConfiguration, {
  useCompilationPromise: true
});

app.use(async (req, res, next) => {
  await createCompilationPromise();
  next();
});


  const sendIndex = (req, res) => {
    const index = (body) => {
      // const htmlHead = require('./htmlHead.txt');
      return '<!doctype html>' + `<html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content = "width = device-width, initial-scale = 1.0, minimum-scale = 1, maximum-scale = 1, user-scalable = no" />
          <meta name="mobile-web-app-capable" content="yes">
          <meta name="apple-mobile-web-app-title" content="TrailMaster" />
          <meta name="apple-mobile-web-app-capable" content="yes">
          <title>Trail Master</title>
          <link rel="stylesheet" href="css/app.css"/>
      </head>
` + `
  <body>
    <div id='app'>${body}</div>
    <style type='text/css'> .uil-poi-css {
  background: none;
  position: absolute;
  top: calc(50% - 200px);
  left: calc(50% + 125px);
  width: 200px;
  height: 200px;
}
width: 100%;
@-webkit-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@-webkit-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@-moz-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@-ms-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@-moz-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@-webkit-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@-o-keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
@keyframes uil-poi-anim0 {
  0% {
    top: 145px;
  }
  12% {
    top: 102px;
  }
  25% {
    top: 70px;
  }
  37% {
    top: 51px;
  }
  50% {
    top: 45px;
  }
  62% {
    top: 50px;
  }
  75% {
    top: 70px;
  }
  87% {
    top: 99px;
  }
  100% {
    top: 145px;
  }
}
width: 100%;
@-webkit-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@-webkit-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@-moz-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@-ms-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@-moz-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@-webkit-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@-o-keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
@keyframes uil-poi-anim1 {
  0% {
    -ms-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(0deg) translate(0, 0);
    transform: translate(0, 0) rotate(0deg) translate(0, 0);
  }
  100% {
    -ms-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -moz-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -webkit-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    -o-transform: translate(0, 0) rotate(360deg) translate(0, 0);
    transform: translate(0, 0) rotate(360deg) translate(0, 0);
  }
}
.uil-poi-css > div {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 90px;
  height: 90px;
  margin-top: -45px;
  margin-left: -45px;
  border-radius: 45px;
  background: none;
  border: 30px solid #11dd19;
  -ms-animation: uil-poi-anim0 1s linear infinite;
  -moz-animation: uil-poi-anim0 1s linear infinite;
  -webkit-animation: uil-poi-anim0 1s linear infinite;
  -o-animation: uil-poi-anim0 1s linear infinite;
  animation: uil-poi-anim0 1s linear infinite;
}
.uil-poi-css > div:after {
  content: " ";
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-top: 30px solid #11dd19;
  position: absolute;
  top: 43px;
  left: -15px;
  -ms-transform: scaleX(0.66);
  -moz-transform: scaleX(0.66);
  -webkit-transform: scaleX(0.66);
  -o-transform: scaleX(0.66);
  transform: scaleX(0.66);
}
 </style>
    <script src='bundle.min.js' type="text/javascript"></script>
  </body>
</html>`;
    };
    const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const appBody = renderToString(evalBundleCode(requestUrl).default);
    res.send(index(appBody));
  };

  app.route('*')
  /**
    * Redirect all http requests to https.  Necessary for using geolocation in client.
    */
    .get(function(req, res, next) {
      /*istanbul ignore if*/
      if (NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect('https://' + req.host + req.url);
      } else {
        /* Continue to other routes if we're not redirecting */
        next();
      }
    });

  app.route('/')
    .get(sendIndex);

  app
    .route('/users')
    .post((req, res) => {
      /**
        * Create a new user account
        */
      let body = _.pick(req.body, ['email', 'password']);
      body.email = body
        .email
        .trim()
        .toLowerCase();
      let user = new UserModel(body);
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

  app
    .route('/users/login')
    .post((req, res) => {
      /**
      * Login with provided user credentials
      */
      let body = _.pick(req.body, ['email', 'password']);

      UserModel.findByCredentials(body.email.trim().toLowerCase(), body.password).then((user) => {
        return user
          .generateAuthToken()
          .then((token) => {
            res
              .header('x-auth', token)
              .send(user);
          });
      }).catch((e) => {
        res
          .status(400)
          .send();
      });
    })
    .get(authenticate, (req, res) => {
      /**
      * Return information about current authenticated user to the clien
      */
      res.send(req.user);
    });

  app
    .route('/users/logout')
    .get(authenticate, (req, res) => {
      /**
      * Logout an authenticated user by deleting their authentication token
      */
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

  app.route('/users/password')
  /**
     * Change a user's password
     */
    .patch((req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    bcrypt
      .hash(body.password, 10)
      .then((hash) => {
        UserModel.update({
          email: body
            .email
            .trim()
            .toLowerCase()
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
      })
      .catch((err) => {
        res
          .status(500)
          .send();
      });
  });

  app.route('/users/reset')
  /**
     * Request to reset a user's password.  Generates a single-use password reset
     * link that is emailed to the user.  Link also expires after 24 hours.
     */
    .post((req, res) => {
    let {email} = _.pick(req.body, ['email']);
    email = email
      .trim()
      .toLowerCase();
    let url = 'http://' + req.get('host') + '/users/reset';
    UserModel
      .resetPassword(email)
      .then((reqID) => {
        let auth = {
          auth: {
            api_key: 'key-52c28f88d00577e50d1d461a6e5dec02',
            domain: 'mg.tjscollins.me'
          }
        };
        let nodemailerMailgun = nodemailer.createTransport(mg(auth));
        let message = {
          from: '"Trailmaster Admin" <tjscollins@gmail.com>',
          to: `${email}`,
          subject: 'Password Recovery',
          text: 'Fix Your Password Here',
          html: `<p>The following is a single-use link to reset your password.</p><p>It will only work for 24 hours</p><a href=\"${url}/${reqID}-${encodeURI(email)}\">Reset Password</a>`
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
    // let toRemove = [];
    let toUse = -1;
    let invalid = true;
    UserModel
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
        UserModel.update({
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
      [lat, lng] = [parseFloat(lat), parseFloat(lng)];
      let lngDegPerMile = Math.cos(lat * Math.PI / 180) / 69;
      let latDegPerMile = 1 / 69;

      PoiModel.find({
        'geometry.coordinates.0': {
          $lt: lng + dist*lngDegPerMile,
          $gt: lng - dist*lngDegPerMile
        },
        'geometry.coordinates.1': {
          $lt: lat + dist*latDegPerMile,
          $gt: lat - dist*latDegPerMile,
        },
      }).then((pois) => {
        res.send({pois});
      }, (e) => {
        res
          .status(400)
          .send(e);
      });
    } else {
      PoiModel
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
    const poi = new PoiModel(req.body);
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
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res
        .status(404)
        .send();
    }

    PoiModel
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

    PoiModel.findByIdAndUpdate(id, {
      $set: req.body
    }, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
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
      let {lat, lng, dist} = query;
      // console.log(query);
      [lat, lng] = [parseFloat(lat), parseFloat(lng)];
      let lngDegPerMile = Math.cos(lat * Math.PI / 180) / 69;
      let latDegPerMile = 1 / 69;
      RouteModel.find({
        'geometry.coordinates.0.0': {
          $lt: lng + dist*lngDegPerMile,
          $gt: lng - dist*lngDegPerMile
        },
        'geometry.coordinates.0.1': {
          $lt: lat + dist*latDegPerMile,
          $gt: lat - dist*latDegPerMile,
        },
      }).then((routes) => {
        // console.log('Routes', routes);
        res.send({routes});
      }, (e) => {
        res
          .status(400)
          .send(e);
      });
    } else {
      RouteModel
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
    var route = new RouteModel(req.body);
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

    RouteModel
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
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res
        .status(404)
        .send();
    }

    RouteModel.findByIdAndUpdate(id, {
      $set: req.body
    }, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }).then((point) => {
      if (!point) {
        return res
          .status(404)
          .send();
      }

      res.send(point);
    }).catch((e) => {
      console.log('Bad PATCH request: ', req.body);
      res
        .status(400)
        .send();
    });
  });

  app.get('/trails', authenticate, (req, res) => {
    TrailModel
      .find({_creator: req.user._id})
      .then((trails) => {
        res.send({trails});
      }, (e) => {
        console.log(e);
        res
          .status(400)
          .send(e);
      });
  });
  app.post('/trails', authenticate, (req, res) => {
    // console.log('Received newTrail:', req.body);
    let trail = new TrailModel({
      bounds: req.body.bounds,
      list: req.body.list,
      name: req.body.name,
      desc: req.body.desc,
      date: req.body.date,
      _creator: new ObjectID(req.user._id)
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

    TrailModel
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

};
