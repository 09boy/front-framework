"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackConfiguration;

var _webpackHelper = require("../share/webpackHelper");

var _path = require("../share/path");

var _smartHelper = require("../share/smartHelper");

var _entryAndOutput = require("./entryAndOutput");

var _loaders = _interopRequireDefault(require("./loaders"));

var _plugins = _interopRequireDefault(require("./plugins"));

var _optimization = _interopRequireDefault(require("./optimization"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackConfiguration(data) {
  if (process.env.NODE_ENV === 'production' && process.env.buildData) {
    data = JSON.parse(process.env.buildData);
  }

  const {
    entryAndOutput,
    plugins,
    type,
    scriptType
  } = (0, _webpackHelper.parseConfigData)(data);
  const isDev = (0, _smartHelper.isDevMode)();
  const envMode = process.env.__MODE__;
  return {
    name: 'smart',
    context: _path.PROJECT_ROOT_PATH,
    mode: isDev ? 'development' : 'production',
    devtool: false,
    // use SourceMapDevToolPlugin
    target: 'web',
    // default is web, you can set 'node'
    plugins: (0, _plugins.default)(plugins),
    module: {
      rules: (0, _loaders.default)(type, scriptType, data.base64Limit)
    },
    resolve: {
      alias: (0, _webpackHelper.getAlias)(data.alias),
      extensions: (0, _webpackHelper.getExtensions)(type, scriptType)
    },
    ...(0, _entryAndOutput.getWebpackEntryAndOutputConfiguration)({ ...entryAndOutput,
      isDevMode: isDev
    }),
    // in webpack 5
    // experiments: {
    //   futureDefaults: true,
    // },
    optimization: (0, _optimization.default)(envMode, type),
    performance: {
      maxAssetSize: type === 'normal' ? 100000 : 200000,
      maxEntrypointSize: type === 'normal' ? 200000 : 300000
    }
  };
}

module.exports = exports.default;