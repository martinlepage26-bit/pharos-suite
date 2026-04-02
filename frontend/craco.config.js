const path = require('path');

module.exports = {
  jest: {
    configure: {
      resolver: path.resolve(__dirname, 'scripts/jest-punycode-resolver.cjs'),
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Add resolve alias for ajv
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'ajv/dist/compile/codegen': path.resolve(__dirname, 'node_modules/ajv/dist/compile/codegen')
      };
      return webpackConfig;
    },
  },
};
