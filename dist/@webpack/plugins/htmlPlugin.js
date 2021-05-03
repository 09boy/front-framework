"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHtmlPlugin = getHtmlPlugin;

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _env = require("../../share/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getHtmlPlugin(publicPath, entryFiles) {
  const devMode = (0, _env.isDevEnv)();
  const instances = [];

  for (const key in entryFiles) {
    if (Object.hasOwnProperty.call(entryFiles, key)) {
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