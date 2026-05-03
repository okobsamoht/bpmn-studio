const path = require('path');

const base = (mode) => ({
  mode: mode || 'development',
  devtool: mode === 'production' ? false : 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist/main')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'electron-updater': 'commonjs electron-updater'
  },
  node: {
    __dirname: false,
    __filename: false
  }
});

module.exports = (env, argv) => {
  const mode = argv && argv.mode;
  return [
    {
      ...base(mode),
      entry: './src/main/main.js',
      target: 'electron-main',
      output: { ...base(mode).output, filename: 'main.js' }
    },
    {
      ...base(mode),
      entry: './src/main/preload.js',
      target: 'electron-preload',
      output: { ...base(mode).output, filename: 'preload.js' }
    }
  ];
};
