"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStylePlugin = getStylePlugin;

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _env = require("../../share/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStylePlugin() {
  const devMode = (0, _env.isDevEnv)();
  let filename = '[name].css';
  let chunkFilename = '[id].css';
  const plugins = [];

  if (!devMode) {
    filename = 'styles/[name].[contenthash].min.css';
    chunkFilename = 'styles/[id].[contenthash].min.css';
  }

  return [new _miniCssExtractPlugin.default({
    filename,
    chunkFilename,
    experimentalUseImportModule: true,
    ignoreOrder: devMode
  }), ...plugins];
}