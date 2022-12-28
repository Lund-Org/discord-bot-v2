//@ts-check

const { withNx } = require('@nrwl/next/plugins/with-nx');
const withMdx = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
});

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

module.exports = withMdx({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  ...withNx(nextConfig),
});
