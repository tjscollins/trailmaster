const webpack = require('webpack');

module.exports = {
  entry: [
    // 'script!jquery/dist/jquery.min.js',
    // 'script!bootstrap-sass/assets/javascripts/bootstrap.min.js',
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
    new webpack
      .optimize
      .OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new webpack
      .optimize
      .UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
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
    preLoaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
};
