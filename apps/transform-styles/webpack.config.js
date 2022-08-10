const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = (config) => {
  nrwlConfig(config);

  return {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new NodePolyfillPlugin({
        excludeAliases: [
          'console',
          'domain',
          'events',
          'http',
          'https',
          'punycode',
          'querystring',
          '_stream_duplex',
          '_stream_passthrough',
          '_stream_transform',
          '_stream_writable',
          'string_decoder',
          'sys',
          'timers',
          'tty',
          'url',
          'util',
          'zlib',
          //
          'assert',
          'buffer',
          'constants',
          'crypto',
          'os',
          'path',
          'stream',
          'vm',
        ],
      }),
    ],
    resolve: {
      ...config.resolve,
      // fallback: {
      //   fs: require.resolve('fs'),
      //   module: require.resolve('module'),
      // },
      preferRelative: true,
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        process: 'process/browser',
      },
    },
    output: {
      ...config.output,
      publicPath: '/',
    },
    devServer: {
      ...config.devServer,
      historyApiFallback: {
        index: '/',
      },
    },
  };
};
