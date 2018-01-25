const path = require('path');
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: [
    path.resolve('./source/index.tsx')
  ],
  module: {
    loaders: [
      {
        test: /\.less/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
    ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve('./build')
  },
  resolve: {
    plugins: [
      new TsconfigPathsWebpackPlugin()
    ],
    extensions: ['.js', '.ts', '.tsx', '.less'],
    modules: ['source', 'node_modules']
  }
};
