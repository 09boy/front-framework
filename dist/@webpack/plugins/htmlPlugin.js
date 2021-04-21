"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHtmlPlugin = getHtmlPlugin;

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHtmlPlugin(devMode, publicPath, entryFiles) {
  const instances = [];

  for (let key in entryFiles) {
    if (entryFiles.hasOwnProperty(key)) {
      const pages = entryFiles[key];
      const options = {
        hash: devMode,
        inject: 'body',
        title: pages.title || key,
        template: 'index.template.html',
        favicon: pages.favicon,
        publicPath
      };
      instances.push(new _htmlWebpackPlugin.default(options));
    }
  }

  return instances;
}