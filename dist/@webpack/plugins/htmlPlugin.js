"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHtmlPlugin = getHtmlPlugin;

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHtmlPlugin(publicPath, entryFile, isDevMode, title, favicon) {
  const option = {
    hash: isDevMode,
    inject: 'body',
    title: title || 'Smart Project',
    template: 'index.template.html',
    favicon,
    publicPath
  };
  return new _htmlWebpackPlugin.default(option);
}