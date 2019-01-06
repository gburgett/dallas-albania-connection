var webpack = require('webpack');

const config = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader'
    }]
  },
  plugins: [
    new webpack.IgnorePlugin(/\.test\.ts/)
  ]
};

module.exports = config;