const nrwlConfig = require('@nrwl/react/plugins/webpack.js');
const webpack = require('webpack');

module.exports = (config) => {
  nrwlConfig(config);
  return {
    ...config,
    node: { global: true },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        process: { env: JSON.stringify(process.env) },
      }),
    ],
  };
};
