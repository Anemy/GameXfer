module.exports = {
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015']
      },
    }]
  },
  target: 'node',
  entry: __dirname + '/src/client/js/index.js',
  output: {
    path: __dirname + '/build/client',
    filename: 'build.js'
  }
};

