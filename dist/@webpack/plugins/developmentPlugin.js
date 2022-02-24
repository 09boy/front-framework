"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevelopmentPlugins = getDevelopmentPlugins;

var _webpack = require("webpack");

var _eslintWebpackPlugin = _interopRequireDefault(require("eslint-webpack-plugin"));

var _path = require("../../share/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import FormatWebpackPlugin from './FormatWebpackPlugin';
function getDevelopmentPlugins(isDevMode, eslintEnabled) {
  const plugins = [];

  if (!isDevMode) {
    return plugins;
  }

  plugins.push(new _webpack.HotModuleReplacementPlugin(), new _webpack.NoEmitOnErrorsPlugin());

  if (eslintEnabled) {
    const options = {
      context: _path.PROJECT_ROOT_PATH,
      // eslintPath: PROJECT_ROOT_PATH + '/eslintrc.js',
      extensions: ['.js', '.ts', '.jsx', '.tsx', 'json'],
      exclude: ['/node_modules', `/bower_components/`],
      fix: true
    };
    plugins.push(new _eslintWebpackPlugin.default(options));
  }

  return plugins;
}