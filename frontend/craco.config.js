const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Remove ForkTsCheckerWebpackPlugin (causes AJV keyword crash in this dependency tree)
      webpackConfig.plugins = (webpackConfig.plugins || []).filter((p) => {
        if (!p || !p.constructor) return true;
        const name = p.constructor.name || '';
        if (name.includes('ForkTsChecker')) return false;

        const opts = p.options || p._options;
        if (opts && (opts.typescript || opts.compiler || opts.issue)) return false;

        return true;
      });

      return webpackConfig;
    },
  },
};