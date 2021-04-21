"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonPlugins = getCommonPlugins;

var _webpack = require("webpack");

function getCommonPlugins(devMode, provide) {
  const items = [new _webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production')
  })];

  if (provide) {
    items.push(new _webpack.ProvidePlugin(provide));
  }

  return items;
}