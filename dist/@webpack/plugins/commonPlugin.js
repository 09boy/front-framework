"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonPlugins = getCommonPlugins;

var _webpack = require("webpack");

var _env = require("../../share/env");

function getCommonPlugins(modeType, mode, provide) {
  const devMode = (0, _env.isDevEnv)();
  const items = [new _webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production')
  })];

  for (const key in mode) {
    if (Object.hasOwnProperty.call(mode, key)) {
      const option = mode[key];

      if (typeof option === 'object' && Object.hasOwnProperty.call(option, modeType)) {
        const value = option[modeType];
        items.push(new _webpack.DefinePlugin({
          [key]: JSON.stringify(value)
        }));
      }
    }
  }

  if (provide) {
    items.push(new _webpack.ProvidePlugin(provide));
  }

  return items;
}