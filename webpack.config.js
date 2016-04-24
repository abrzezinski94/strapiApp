var webpack = require('webpack');
module.exports = {
    entry: "./app/public/app.js",
    output: {
        path: "./app/public",
        filename: "bundle.min.js"
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
          include: /\.min\.js$/,
          minimize: true
      })
    ]
};
