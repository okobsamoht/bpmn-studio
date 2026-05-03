const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const mode = (argv && argv.mode) || 'development';
  const isProd = mode === 'production';

  return {
    mode,
    devtool: isProd ? false : 'source-map',
    entry: './src/renderer/index.jsx',
    target: 'electron-renderer',
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'renderer.js',
      publicPath: './'
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      fallback: { path: false, fs: false }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.bpmnlintrc$/,
          use: [
            { loader: 'babel-loader' },
            { loader: 'bpmnlint-loader' }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)(\?.*)?$/,
          type: 'asset/resource',
          generator: { filename: 'fonts/[name][ext]' }
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html',
        filename: 'index.html',
        minify: isProd
      }),
      new MiniCssExtractPlugin({ filename: 'styles.css' })
    ],
    performance: {
      hints: false
    }
  };
};
