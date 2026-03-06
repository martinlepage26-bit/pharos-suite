const path = require('path');

module.exports = {
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
