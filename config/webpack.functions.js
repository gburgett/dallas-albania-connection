module.exports = {
  mode: "development",
  module: {
    rules: [
      // override the default in netlify-lambda/build.js to use babel-loader
      {
        test: /\.(m?js|ts)?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  }
}