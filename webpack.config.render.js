const webpack = require('webpack');
const path = require('path');

export default {
  context: __dirname,
  entry: {
    app: [path.resolve(__dirname, './client/react/react-app.jsx')]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public')
  },
  resolve: {
    alias: {
      'mapboxgl': path.resolve(__dirname, 'client/api/mockmapbox'),
    },
    modules: [
      __dirname,
      'node_modules',
      path.join(__dirname, 'client/api'),
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
            'plugins': [],
          }
        }
      }, {
        loaders: [
          {
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
          },
          'resolve-url-loader'
        ],
        test: /\.css$/
      }
    ]
  },
};
