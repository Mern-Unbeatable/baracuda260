const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

const loadEnv = (mode) => {
  const isProd = mode === 'production';
  const envFile = isProd ? '.env.production' : '.env.development';
  const envPath = path.resolve(__dirname, envFile);
  const fallbackPath = path.resolve(__dirname, '.env');
  return fs.existsSync(envPath)
    ? dotenv.parse(fs.readFileSync(envPath))
    : fs.existsSync(fallbackPath)
      ? dotenv.parse(fs.readFileSync(fallbackPath))
      : {};
};

module.exports = (mode = 'development') => {
  const isProd = mode === 'production';
  const rawEnv = loadEnv(mode);
  const apiBase = rawEnv.REACT_APP_API_BASE_URL || 'https://backend.c4r.co.uk';
  const wsBase = apiBase.replace(/^https?/, (m) => (m === 'https' ? 'wss' : 'ws'));
  const cspScriptSrc = isProd ? "'self'" : "'self' 'unsafe-eval'";

  return {
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      chunkFilename: isProd ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify({
          NODE_ENV: mode,
          ...rawEnv,
        }),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        cspScriptSrc,
        apiBase,
        wsBase,
        minify: isProd
          ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'public'),
            to: path.join(__dirname, 'dist'),
            globOptions: { ignore: ['**/index.html'] },
          },
        ],
      }),
    ],
  };
};

module.exports.loadEnv = loadEnv;
