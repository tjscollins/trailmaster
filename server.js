'use strict';

var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TrailMaster';
}

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TrailMaster', options);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var webpack$1 = require('webpack');
var path$1 = require('path');

var webpackConfiguration = {
  context: __dirname,
  entry: {
    app: [path$1.resolve(__dirname, './client/react/react-app.jsx')]
  },
  plugins: [new webpack$1.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })],
  output: {
    filename: '[name].js',
    path: path$1.resolve(__dirname, './public')
  },
  resolve: {
    alias: {
      'mapboxgl': path$1.resolve(__dirname, 'client/api/mockmapbox')
    },
    modules: [__dirname, 'node_modules', path$1.join(__dirname, 'client/api'), path$1.join(__dirname, 'client/react'), path$1.join(__dirname, 'client/react/components'), path$1.join(__dirname, 'client/react/components/controls/PoI_Controls'), path$1.join(__dirname, 'client/react/components/controls/Route_Controls'), path$1.join(__dirname, 'client/react/components/controls/Trail_Controls'), path$1.join(__dirname, 'client/redux')],
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
    // For loading Markdown
    {
      test: /\.(txt|md)$/,
      loader: 'raw-loader'
    },
    // Loader for JSON, used in some tests
    {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        query: {
          'babelrc': false,
          'presets': [['es2015', {
            'modules': false
          }], ['react'], ['stage-0']],
          'plugins': []
        }
      }
    }, {
      loaders: [{
        loader: 'style-loader',
        query: {
          sourceMap: 1
        }
      }, {
        loader: 'css-loader',
        query: {
          importLoaders: 1,
          localIdentName: '[path]___[name]___[local]',
          modules: 1
        }
      }, 'resolve-url-loader'],
      test: /\.css$/
    }]
  }
};

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

/*eslint-disable require-jsdoc*/

var path = require('path');

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

var _require = require('isomorphic-webpack');
var createIsomorphicWebpack = _require.createIsomorphicWebpack;

var _require2 = require('react-dom/server');
var renderToString = _require2.renderToString;

var PoiModel = require('./server/db/models/poi');
var RouteModel = require('./server/db/models/route');
var TrailModel = require('./server/db/models/trail');
var UserModel = require('./server/db/models/user');

var _require3 = require('./server/middleware/authenticate');
var authenticate = _require3.authenticate;

var _ = require('lodash');

var _require4 = require('mongodb');
var ObjectID = _require4.ObjectID;

var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var bcrypt = require('bcryptjs');

var NODE_ENV = process.env.NODE_ENV || 'development';

function routes(app, mongoose) {
  var _this = this;

  var compiler = webpack(webpackConfiguration);

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

  var _createIsomorphicWebp = createIsomorphicWebpack(webpackConfiguration, {
    useCompilationPromise: true
  }),
      createCompilationPromise = _createIsomorphicWebp.createCompilationPromise,
      evalBundleCode = _createIsomorphicWebp.evalBundleCode;

  app.use(function () {
    var _ref = asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return createCompilationPromise();

            case 2:
              next();

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }());

  var sendIndex = function sendIndex(req, res) {
    var index = function index(body) {
      // const htmlHead = require('./htmlHead.txt');
      return '<!doctype html>' + '<html>\n        <head>\n          <meta charset="utf-8" />\n          <meta name="viewport" content = "width = device-width, initial-scale = 1.0, minimum-scale = 1, maximum-scale = 1, user-scalable = no" />\n          <meta name="mobile-web-app-capable" content="yes">\n          <meta name="apple-mobile-web-app-title" content="TrailMaster" />\n          <meta name="apple-mobile-web-app-capable" content="yes">\n          <title>Trail Master</title>\n          <link rel="stylesheet" href="css/app.css"/>\n      </head>\n' + ('\n  <body>\n    <div id=\'app\'>' + body + '</div>\n    <style type=\'text/css\'> .uil-spin-css {\n  background: none;\n  position: absolute;\n  top: calc(50% - 200px);\n  left: calc(50% - 100px);\n  width: 200px;\n  height: 200px;\n}\nwidth: 100%;\n@-webkit-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@-webkit-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@-moz-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@-ms-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@-moz-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@-webkit-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@-o-keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n@keyframes uil-spin-css {\n  0% {\n    opacity: 1;\n    -ms-transform: scale(1.5);\n    -moz-transform: scale(1.5);\n    -webkit-transform: scale(1.5);\n    -o-transform: scale(1.5);\n    transform: scale(1.5);\n  }\n  100% {\n    opacity: 0.1;\n    -ms-transform: scale(1);\n    -moz-transform: scale(1);\n    -webkit-transform: scale(1);\n    -o-transform: scale(1);\n    transform: scale(1);\n  }\n}\n.uil-spin-css > div {\n  width: 24px;\n  height: 24px;\n  margin-left: 4px;\n  margin-top: 4px;\n  position: absolute;\n}\n.uil-spin-css > div > div {\n  width: 100%;\n  height: 100%;\n  border-radius: 15px;\n  background: black;\n}\n.uil-spin-css > div:nth-of-type(1) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0s;\n  -moz-animation-delay: 0s;\n  -webkit-animation-delay: 0s;\n  -o-animation-delay: 0s;\n  animation-delay: 0s;\n}\n.uil-spin-css > div:nth-of-type(1) {\n  -ms-transform: translate(84px, 84px) rotate(45deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(45deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(45deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(45deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(45deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(2) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.12s;\n  -moz-animation-delay: 0.12s;\n  -webkit-animation-delay: 0.12s;\n  -o-animation-delay: 0.12s;\n  animation-delay: 0.12s;\n}\n.uil-spin-css > div:nth-of-type(2) {\n  -ms-transform: translate(84px, 84px) rotate(90deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(90deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(90deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(90deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(90deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(3) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.25s;\n  -moz-animation-delay: 0.25s;\n  -webkit-animation-delay: 0.25s;\n  -o-animation-delay: 0.25s;\n  animation-delay: 0.25s;\n}\n.uil-spin-css > div:nth-of-type(3) {\n  -ms-transform: translate(84px, 84px) rotate(135deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(135deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(135deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(135deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(135deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(4) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.37s;\n  -moz-animation-delay: 0.37s;\n  -webkit-animation-delay: 0.37s;\n  -o-animation-delay: 0.37s;\n  animation-delay: 0.37s;\n}\n.uil-spin-css > div:nth-of-type(4) {\n  -ms-transform: translate(84px, 84px) rotate(180deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(180deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(180deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(180deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(180deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(5) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.5s;\n  -moz-animation-delay: 0.5s;\n  -webkit-animation-delay: 0.5s;\n  -o-animation-delay: 0.5s;\n  animation-delay: 0.5s;\n}\n.uil-spin-css > div:nth-of-type(5) {\n  -ms-transform: translate(84px, 84px) rotate(225deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(225deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(225deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(225deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(225deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(6) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.62s;\n  -moz-animation-delay: 0.62s;\n  -webkit-animation-delay: 0.62s;\n  -o-animation-delay: 0.62s;\n  animation-delay: 0.62s;\n}\n.uil-spin-css > div:nth-of-type(6) {\n  -ms-transform: translate(84px, 84px) rotate(270deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(270deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(270deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(270deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(270deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(7) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.75s;\n  -moz-animation-delay: 0.75s;\n  -webkit-animation-delay: 0.75s;\n  -o-animation-delay: 0.75s;\n  animation-delay: 0.75s;\n}\n.uil-spin-css > div:nth-of-type(7) {\n  -ms-transform: translate(84px, 84px) rotate(315deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(315deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(315deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(315deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(315deg) translate(70px, 0);\n}\n.uil-spin-css > div:nth-of-type(8) > div {\n  -ms-animation: uil-spin-css 1s linear infinite;\n  -moz-animation: uil-spin-css 1s linear infinite;\n  -webkit-animation: uil-spin-css 1s linear infinite;\n  -o-animation: uil-spin-css 1s linear infinite;\n  animation: uil-spin-css 1s linear infinite;\n  -ms-animation-delay: 0.87s;\n  -moz-animation-delay: 0.87s;\n  -webkit-animation-delay: 0.87s;\n  -o-animation-delay: 0.87s;\n  animation-delay: 0.87s;\n}\n.uil-spin-css > div:nth-of-type(8) {\n  -ms-transform: translate(84px, 84px) rotate(360deg) translate(70px, 0);\n  -moz-transform: translate(84px, 84px) rotate(360deg) translate(70px, 0);\n  -webkit-transform: translate(84px, 84px) rotate(360deg) translate(70px, 0);\n  -o-transform: translate(84px, 84px) rotate(360deg) translate(70px, 0);\n  transform: translate(84px, 84px) rotate(360deg) translate(70px, 0);\n}\n </style>\n    <script src=\'bundle.min.js\' type="text/javascript"></script>\n  </body>\n</html>');
    };
    var requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var appBody = renderToString(evalBundleCode(requestUrl).default);
    res.send(index(appBody));
  };

  app.route('*')
  /**
    * Redirect all http requests to https.  Necessary for using geolocation in client.
    */
  .get(function (req, res, next) {
    /*istanbul ignore if*/
    if (NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect('https://' + req.host + req.url);
    } else {
      /* Continue to other routes if we're not redirecting */
      next();
    }
  });

  app.route('/').get(sendIndex);

  app.route('/users').post(function (req, res) {
    /**
      * Create a new user account
      */
    var body = _.pick(req.body, ['email', 'password']);
    body.email = body.email.trim().toLowerCase();
    var user = new UserModel(body);
    user.save().then(function () {
      return user.generateAuthToken();
    }).then(function (token) {
      res.header('x-auth', token).send(user);
    }).catch(function (e) {
      res.status(400).send(e);
    });
  });

  app.route('/users/login').post(function (req, res) {
    /**
    * Login with provided user credentials
    */
    var body = _.pick(req.body, ['email', 'password']);

    UserModel.findByCredentials(body.email.trim().toLowerCase(), body.password).then(function (user) {
      return user.generateAuthToken().then(function (token) {
        res.header('x-auth', token).send(user);
      });
    }).catch(function (e) {
      res.status(400).send();
    });
  }).get(authenticate, function (req, res) {
    /**
    * Return information about current authenticated user to the clien
    */
    res.send(req.user);
  });

  app.route('/users/logout').get(authenticate, function (req, res) {
    /**
    * Logout an authenticated user by deleting their authentication token
    */
    req.user.removeToken(req.token).then(function () {
      res.status(200).send();
    }, function () {
      res.status(400).send();
    });
  });

  app.route('/users/password')
  /**
     * Change a user's password
     */
  .patch(function (req, res) {
    var body = _.pick(req.body, ['email', 'password']);
    bcrypt.hash(body.password, 10).then(function (hash) {
      UserModel.update({
        email: body.email.trim().toLowerCase()
      }, {
        password: hash
      }, function (err, raw) {
        if (err) console.log('Error patching password', err);
      });
    }).then(function () {
      res.redirect(303, '/');
    }).catch(function (err) {
      res.status(500).send();
    });
  });

  app.route('/users/reset')
  /**
     * Request to reset a user's password.  Generates a single-use password reset
     * link that is emailed to the user.  Link also expires after 24 hours.
     */
  .post(function (req, res) {
    var _$pick = _.pick(req.body, ['email']),
        email = _$pick.email;

    email = email.trim().toLowerCase();
    var url = 'http://' + req.get('host') + '/users/reset';
    UserModel.resetPassword(email).then(function (reqID) {
      var auth = {
        auth: {
          api_key: 'key-52c28f88d00577e50d1d461a6e5dec02',
          domain: 'mg.tjscollins.me'
        }
      };
      var nodemailerMailgun = nodemailer.createTransport(mg(auth));
      var message = {
        from: '"Trailmaster Admin" <tjscollins@gmail.com>',
        to: '' + email,
        subject: 'Password Recovery',
        text: 'Fix Your Password Here',
        html: '<p>The following is a single-use link to reset your password.</p><p>It will only work for 24 hours</p><a href="' + url + '/' + reqID + '-' + encodeURI(email) + '">Reset Password</a>'
      };
      nodemailerMailgun.sendMail(message, function (err, info) {
        if (err) {
          console.log('Error: ' + err);
        } else {
          // console.log('Response: ' + info);
        }
      });
      res.status(200).send();
    }).catch(function (e) {
      res.status(400).send(e);
    });
  });
  app.get('/users/reset/:reqID-:email', function (req, res) {
    var _req$params = req.params,
        reqID = _req$params.reqID,
        email = _req$params.email;
    // let toRemove = [];

    var toUse = -1;
    var invalid = true;
    UserModel.find({ email: email }).then(function (user) {
      if (!user.length) {
        return Promise.reject('No such user');
      }
      var remainingRequests = user[0].resetRequests.filter(function (request, i) {
        var currentTime = new Date().getTime();
        var interval = currentTime - request.time;
        if (bcrypt.compare(reqID, request.reqID)) {
          invalid = false;
          toUse = i;
          res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-che' + 'ck=0');
          res.sendFile(path.join(__dirname, '/../restricted/password-reset.html'));
        }
        return toUse !== i && interval > 0 && interval < 86400000;
      });
      if (invalid) {
        res.sendStatus(403);
      }
      UserModel.update({
        email: email
      }, { resetRequests: remainingRequests }).then(function (person) {
        // console.log(user);
      });
    });
  });

  app.get('/pois', function (req, res) {
    var query = req.query;

    if (query.hasOwnProperty('lat') && query.hasOwnProperty('lng') && query.hasOwnProperty('dist')) {
      var lat = query.lat,
          lng = query.lng,
          dist = query.dist;
      var _ref2 = [parseFloat(lat), parseFloat(lng)];
      lat = _ref2[0];
      lng = _ref2[1];

      var lngDegPerMile = Math.cos(lat * Math.PI / 180) / 69;
      var latDegPerMile = 1 / 69;

      PoiModel.find({
        'geometry.coordinates.0': {
          $lt: lng + dist * lngDegPerMile,
          $gt: lng - dist * lngDegPerMile
        },
        'geometry.coordinates.1': {
          $lt: lat + dist * latDegPerMile,
          $gt: lat - dist * latDegPerMile
        }
      }).then(function (pois) {
        res.send({ pois: pois });
      }, function (e) {
        res.status(400).send(e);
      });
    } else {
      PoiModel.find().then(function (pois) {
        res.send({ pois: pois });
      }, function (e) {
        res.status(400).send(e);
      });
    }
  });
  app.post('/pois', function (req, res) {
    var poi = new PoiModel(req.body);
    poi.save().then(function (doc) {
      res.send(doc);
    }, function (e) {
      res.status(400).send(e);
    });
  });
  app.delete('/pois/:id', function (req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    PoiModel.markForDelete(id).then(function (point) {
      if (!point) {
        return res.status(404).send();
      }
      res.send(point);
    }).catch(function (e) {
      res.status(400).send(e);
    });
  });
  app.patch('/pois/:id', function (req, res) {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    PoiModel.findByIdAndUpdate(id, {
      $set: req.body
    }, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }).then(function (point) {
      if (!point) {
        return res.status(404).send();
      }

      res.send(point);
    }).catch(function (e) {
      res.status(400).send();
    });
  });

  app.get('/routes', function (req, res) {
    var query = req.query;

    if (query.hasOwnProperty('lat') && query.hasOwnProperty('lng')) {
      var lat = query.lat,
          lng = query.lng,
          dist = query.dist;
      // console.log(query);

      var _ref3 = [parseFloat(lat), parseFloat(lng)];
      lat = _ref3[0];
      lng = _ref3[1];

      var lngDegPerMile = Math.cos(lat * Math.PI / 180) / 69;
      var latDegPerMile = 1 / 69;
      RouteModel.find({
        'geometry.coordinates.0.0': {
          $lt: lng + dist * lngDegPerMile,
          $gt: lng - dist * lngDegPerMile
        },
        'geometry.coordinates.0.1': {
          $lt: lat + dist * latDegPerMile,
          $gt: lat - dist * latDegPerMile
        }
      }).then(function (routes) {
        // console.log('Routes', routes);
        res.send({ routes: routes });
      }, function (e) {
        res.status(400).send(e);
      });
    } else {
      RouteModel.find().then(function (routes) {
        res.send({ routes: routes });
      }, function (e) {
        res.status(400).send(e);
      });
    }
  });
  app.post('/routes', function (req, res) {
    var route = new RouteModel(req.body);
    route.save().then(function (doc) {
      res.send(doc);
    }, function (e) {
      res.status(400).send(e);
    });
  });
  app.delete('/routes/:id', function (req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    RouteModel.markForDelete(id).then(function (point) {
      if (!point) {
        return res.status(404).send();
      }
      res.send(point);
    }).catch(function (e) {
      res.status(400).send();
    });
  });
  app.patch('/routes/:id', function (req, res) {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    RouteModel.findByIdAndUpdate(id, {
      $set: req.body
    }, {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }).then(function (point) {
      if (!point) {
        return res.status(404).send();
      }

      res.send(point);
    }).catch(function (e) {
      console.log('Bad PATCH request: ', req.body);
      res.status(400).send();
    });
  });

  app.get('/trails', authenticate, function (req, res) {
    TrailModel.find({ _creator: req.user._id }).then(function (trails) {
      res.send({ trails: trails });
    }, function (e) {
      console.log(e);
      res.status(400).send(e);
    });
  });
  app.post('/trails', authenticate, function (req, res) {
    // console.log('Received newTrail:', req.body);
    var trail = new TrailModel({
      bounds: req.body.bounds,
      list: req.body.list,
      name: req.body.name,
      desc: req.body.desc,
      date: req.body.date,
      _creator: new ObjectID(req.user._id)
    });
    trail.save().then(function (doc) {
      res.send(doc);
    }, function (e) {
      res.status(400).send(e);
    });
  });
  app.delete('/trails/:id', function (req, res) {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    TrailModel.findByIdAndRemove(id).then(function (trail) {
      if (!trail) {
        return res.status(404).send();
      }
      res.send(trail);
    }).catch(function (e) {
      res.status(400).send();
    });
  });
}

// require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var PORT = process.env.PORT || 3000;

//Create our app
var app = express();
app.use(bodyParser.json());
app.use(compression());
routes(app, mongoose);
app.use(express.static('public'));
mongoose.connection.once('open', function () {
  // Wait for the database connection to establish, then start the app.
  app.listen(PORT);
});

module.exports = {
  app: app
};
