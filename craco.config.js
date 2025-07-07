const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Add a rule to handle absolute imports
      webpackConfig.resolve.alias['@'] = path.resolve(__dirname, 'src');
      return webpackConfig;
    },
  },
};