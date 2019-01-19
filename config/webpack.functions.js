module.exports = {
  mode: "development",
  module: {
    rules: [
      // override the default in netlify-lambda/build.js to use ts-loader
      {
        test: /\.(m?js|ts)?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader'
        }
      },
    ]
  }
}