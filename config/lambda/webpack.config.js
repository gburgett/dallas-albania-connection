var webpack = require('webpack');
var glob = require('glob');

const config = {
  entry: glob.sync('./*.(ts|js)', {
      cwd: process.cwd() + './src/lambda'
    }).reduce((o, key) => ({
      ...o, [key.replace(/\.(m?js|ts)$/, '')]: key
    }), {}),
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