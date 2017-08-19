module.exports = {
  entry: './src/client/js/index.js',
  output: {
    path: __dirname + '/build/client',
    filename: 'build.js'
  },
  cache: true,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
        presets: ['es2015']
      },
    }]
  }
};