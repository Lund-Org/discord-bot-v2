//@ts-check

const webpackConfig = require('./webpack.config');
const { withNx } = require('@nx/next/plugins/with-nx');

const withMdx = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
});

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  experimental: {
    esmExternals: false,
  },
};

const mdxConfig = withMdx({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
});

module.exports = withNx({
  ...mdxConfig,
  ...nextConfig,
  webpack: (config, context) =>
    webpackConfig(config, mdxConfig.webpack, context),
});
