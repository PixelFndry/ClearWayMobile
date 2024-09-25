const { withPlugins } = require('@expo/config-plugins');

module.exports = function withReactNativeWebView(config) {
  return withPlugins(config, []);
};
