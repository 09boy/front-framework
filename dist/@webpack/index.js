"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configuration;

var _path = require("../share/path");

var _entryAndOutput = require("./entryAndOutput");

var _tool = require("./tool");

var _loaders = _interopRequireDefault(require("./loaders"));

var _plugins = _interopRequireDefault(require("./plugins"));

var _optimization = _interopRequireDefault(require("./optimization"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configuration(option) {
  var _option$configOption;

  if (process.env.BuildConfig) {
    option = JSON.parse(process.env.BuildConfig);
  }

  const {
    devMode,
    name,
    target,
    devtool,
    entryOutOption,
    pluginsProps,
    loadersProps,
    resolveAlias,
    performance,
    optimization,
    resolveExtensions
  } = (0, _tool.parseConfigData)(option);
  return {
    name,
    context: _path.PROJECT_ROOT_PATH,
    ...(0, _entryAndOutput.getWebpackEntryAndOutputConfiguration)(entryOutOption),
    //issue: target HRM: https://github.com/webpack/webpack-dev-server/issues/2758
    target,
    mode: devMode ? 'development' : 'production',
    devtool,
    module: {
      unsafeCache: true,
      rules: (0, _loaders.default)(loadersProps, (_option$configOption = option.configOption) === null || _option$configOption === void 0 ? void 0 : _option$configOption.loaderIncludes)
      /*parser: {
        javascript: {
          commonjsMagicComments: true,
          url: 'relative'
        },
      },*/

    },
    plugins: (0, _plugins.default)(pluginsProps),
    resolve: {
      alias: resolveAlias,
      preferRelative: true,
      symlinks: true,
      roots: [_path.PROJECT_ROOT_PATH],
      extensions: resolveExtensions
    },
    resolveLoader: {
      //
      modules: [`${_path.SMART_ROOT_PATH}/node_modules`],
      extensions: ['.js', '.json']
    },
    optimization: (0, _optimization.default)(optimization),
    stats: {
      cached: true,
      cachedAssets: true,
      cachedModules: true
    },
    performance
  };
}

module.exports = exports.default;