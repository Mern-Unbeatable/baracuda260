const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  const envFile = isProd ? '.env.production' : '.env.development';
  const envPath = path.resolve(__dirname, envFile);
  const fallbackPath = path.resolve(__dirname, '.env');
  const rawEnv = fs.existsSync(envPath)
    ? dotenv.parse(fs.readFileSync(envPath))
    : fs.existsSync(fallbackPath)
      ? dotenv.parse(fs.readFileSync(fallbackPath))
      : {};

  const envKeys = {
    'process.env': JSON.stringify({
      NODE_ENV: argv.mode || 'development',
      ...rawEnv,
    }),
  };

  const devPort = parseInt(rawEnv.REACT_APP_DEV_PORT || '5173', 10);

  // Values injected into the HTML template for a dynamic Content Security Policy
  const apiBase = rawEnv.REACT_APP_API_BASE_URL || 'https://backend.c4r.co.uk';
  const wsBase = apiBase.replace(/^https?/, (m) => (m === 'https' ? 'wss' : 'ws'));
  // Allow eval() in development for webpack source-map devtool
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
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        // CSP values — evaluated by EJS template in public/index.html
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
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash:8].css',
              chunkFilename: 'css/[name].[contenthash:8].chunk.css',
            }),
          ]
        : []),
    ],
    optimization: {
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'vendor-react',
            chunks: 'all',
            priority: 20,
          },
          redux: {
            test: /[\\/]node_modules[\\/](@reduxjs|react-redux)[\\/]/,
            name: 'vendor-redux',
            chunks: 'all',
            priority: 10,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 1,
          },
        },
      },
      runtimeChunk: 'single',
    },
    devServer: {
      static: false,
      historyApiFallback: true,
      port: devPort,
      hot: true,
      open: true,
      compress: true,

      proxy: {
        '/api': {
          target: rawEnv.REACT_APP_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    devtool: isProd ? 'hidden-source-map' : 'eval-cheap-module-source-map',
  };
};
