const { merge } = require('webpack-merge');
const createCommon = require('./webpack.common.js');

const { loadEnv } = createCommon;
const rawEnv = loadEnv('development');
const devPort = parseInt(rawEnv.REACT_APP_DEV_PORT || '5173', 10);

module.exports = merge(createCommon('development'), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  optimization: {
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
});
