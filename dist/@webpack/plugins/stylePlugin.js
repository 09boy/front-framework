"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStylePlugin = getStylePlugin;

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStylePlugin(isDevMode) {
  let filename = '[name].css';
  let chunkFilename = '[id].css';

  if (!isDevMode) {
    filename = 'styles/[name].[contenthash].min.css';
    chunkFilename = 'styles/[id].[contenthash].min.css';
  }

  const plugins = [];
  return [new _miniCssExtractPlugin.default({
    filename,
    chunkFilename,
    experimentalUseImportModule: true,
    ignoreOrder: isDevMode
  }), ...plugins];
}