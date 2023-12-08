// const nrwlConfig = require('@nx/next/plugins/webpack.js');
const { merge } = require('webpack-merge');

module.exports = (config, mdxFn, context) => {
  const mergedConfig = merge(
    config,
    mdxFn(
      {
        resolve: {
          alias: {},
        },
        module: {
          rules: [],
        },
      },
      context,
    ),
  );

  return mergedConfig;
};
