const webpackConfig = require('./webpack.config.dev.js');

module.exports = function(config) {
  config.set({
    autowatch: false,
    browsers: ['Chrome', 'Firefox'],
    singleRun: true,
    frameworks: [
      'mocha', 'sinon'
    ],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'tests/client/**/*.test.jsx'
    ],
    preprocessors: {
      'tests/client/**/*.test.jsx': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    client: {
      captureConsole: true,
      mocha: {
        bail: true,
        timeout: '5000'
      }
    },
    browserNoActivityTimeout: 100000,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  });
};
