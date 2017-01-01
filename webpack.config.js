var webpack = require('webpack');

module.exports = {
  entry: [
    'script!jquery/dist/jquery.min.js', 'script!bootstrap/dist/js/bootstrap.min.js', './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({'$': 'jquery', 'jQuery': 'jquery', 'jquery': 'jquery'}),
    new webpack
      .optimize
      .OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack
      .optimize
      .UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './app/components/',
      './app/components/controls/PoI_Controls',
      './app/components/controls/Route_Controls',
      './app/components/controls/Trail_Controls',
      './app/api'
    ],
    alias: {
      Main: 'app/components/Main.jsx',
      applicationStyles: 'app/styles/app.scss',
      actions: 'app/redux/actions/actions.jsx',
      reducers: 'app/redux/reducers/reducers.jsx',
      configureStore: 'app/redux/store/configureStore.jsx',
      geoJSON: 'app/redux/store/geoJSON.js'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {
        test: /\.json$/,
        loader: 'json'
      }
    ],
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  // devtool: 'eval-source-map'
};
