const path = require('path');

module.exports = {
  entry: [
    path.resolve('./source/index.ts')
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
      { test: /\.ts/, loader: 'ts-loader' }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve('./build')
  },
  resolve: {
    extensions: ['.js', '.ts', '.less'],
    modules: ['source', 'node_modules']
  }
};
