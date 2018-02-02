const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
    // Turn on sourcemaps
  devtool: 'source-map',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
}
