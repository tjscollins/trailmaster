const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: [
    'script-loader!jquery/dist/jquery.min.js',
    'script-loader!bootstrap-sass/assets/javascripts/bootstrap.min.js',
    './client/react/react-app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
    }),
    new UglifyJSPlugin({
      mangle: true,
      compressor: false, // causes errors if true
    }),
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    alias: {
      'mapboxgl': 'mapbox-gl/dist/mapbox-gl.js'
    },
    modules: [
      __dirname, 'node_modules', path.join(__dirname, 'client/api'),
      path.join(__dirname, 'client/react'),
      path.join(__dirname, 'client/react/components'),
      path.join(__dirname, 'client/react/components/controls/PoI_Controls'),
      path.join(__dirname, 'client/react/components/controls/Route_Controls'),
      path.join(__dirname, 'client/react/components/controls/Trail_Controls'),
      path.join(__dirname, 'client/redux')
    ],
    extensions: ['.js', '.jsx', '.json']
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
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          query: {
            'babelrc': false,
            'presets': [
              [
                'es2015', {
                  'modules': false
                }
              ],
              ['react'],
              ['stage-0']
            ],
            'plugins': []
          }
        }
      }
    ]
  }
};
