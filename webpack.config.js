// Got instructions from:
// https://www.freecodecamp.org/news/how-to-use-reactjs-with-webpack-4-babel-7-and-material-design-ff754586f618/

import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

module.exports = {
  // These are used to tell our server what has to be compiled and from where
  // (entry: path.join(__dirname,’src’,’index.js’),). It also tells where to
  // put the outputted compiled version (output — the folder and the filename)
  entry: path.join(__dirname, 'src', 'app.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'app.bundle.js'
  },

  // This is the mode of our output
  mode: process.env.NODE_ENV || 'development',

  // This is used so that we can import anything from src folder in relative
  // paths instead of absolute ones. It is the same for the node_modules. We
  // can import anything from node_modules directly without absolute paths
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
  },

  // This tells the webpack-dev-server what files are needed to be served.
  // Everything from our src folder needs to be served (outputted) in the
  // browser
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        // This is so that we can compile any React, ES6 and above into normal
        // ES5 syntax
        test: /\.(js|jsx)$/,
        // We do not want anything from node_modules to be compiled
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [
          // creates style nodes from JS strings
          "style-loader",
          // translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true
            }
          },
          // compiles Sass to CSS, using Node Sass by default
          "sass-loader"
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loaders: ['file-loader']
      }
    ]
  },

  // Here we set what plugins we need in our app. As of this moment we only
  // need the html-webpack-plugin which tells the server that the
  // index.bundle.js should be injected (or added if you will) to our
  // index.html file
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'app.html')
    })
  ]
}
