const commonConfig = require('./common.config.js');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = Object.assign(commonConfig, {
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new UglifyJSPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});