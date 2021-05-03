"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonPlugins = getCommonPlugins;

var _webpack = require("webpack");

var _env = require("../../share/env");

function getCommonPlugins(provide) {
  const devMode = (0, _env.isDevEnv)();
  const items = [new _webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production')
  })];

  if (provide) {
    items.push(new _webpack.ProvidePlugin(provide));
  }

  return items;
}