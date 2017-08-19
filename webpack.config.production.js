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
  // target: 'node',
  // node: {
  //   fs: false,
  //   fileSystem: false
  // }
  entry: './src/client/js/index.js',
  output: {
    path: __dirname + '/build/client',
    filename: 'build.js'
  }
};

