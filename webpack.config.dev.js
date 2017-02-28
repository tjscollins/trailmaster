const webpack = require('webpack');

const preLoaders = [
  {
    test: /\.css$/,
    loader: 'null',
  }, {
    test: /\.mp4$/,
    loader: 'null',
  }, {
    test: /\.svg$/,
    loader: 'null',
  }, {
    test: /\.png$/,
    loader: 'null',
  }, {
    test: /\.jpg$/,
    loader: 'null',
  }, {
    test: /\.gif$/,
    loader: 'null',
  }, {
    test: /\.(otf|eot|ttf|woff|woff2)/,
    loader: 'null',
  },

  // Loader for JSON, used in some tests
  {
    test: /\.json$/,
    loader: 'json',
  },
];

const loaders = [
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    query: {
      presets: ['react', 'es2015', 'stage-0'],
    },
    exclude: /(node_modules|bower_components)/,
  },
];

const postLoaders = [
  {
    test: /\.jsx?$/,
    exclude: /(test|node_modules|bower_components)/,
    loader: 'istanbul-instrumenter',
  },
];


module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    'script!bootstrap/dist/js/bootstrap.min.js',
    './client/react/react-app.jsx',

  ],
  externals: {
    jquery: 'jQuery',
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'jquery': 'jquery',
    }),
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      'client/react/components/',
      'client/react/components/controls/PoI_Controls',
      'client/react/components/controls/Route_Controls',
      'client/react/components/controls/Trail_Controls',
      'client/api',
      'client/redux/',
    ],
    alias: {},
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    preLoaders,
    loaders,
    postLoaders,
  },
  devtool: 'eval-source-map',
};
