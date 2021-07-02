"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevelopmentPlugins = getDevelopmentPlugins;

var _webpack = require("webpack");

var _path = require("../../share/path");

var _env = require("../../share/env");

var _FormatWebpackPlugin = _interopRequireDefault(require("./FormatWebpackPlugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDevelopmentPlugins({
  projectType,
  scriptType
}) {
  const devMode = (0, _env.isDevEnv)();

  if (!devMode) {
    return [];
  }

  const options = {
    // context: PROJECT_ROOT_PATH,
    extensions: ['.js', '.ts'],
    exclude: [_path.PROJECT_ROOT_PATH + '/node_modules'],
    fix: true
  };
  return [new _webpack.HotModuleReplacementPlugin(), new _webpack.NoEmitOnErrorsPlugin(), // new ESLintPlugin(options),
  new _FormatWebpackPlugin.default({
    src: 'hello'
  })];
}