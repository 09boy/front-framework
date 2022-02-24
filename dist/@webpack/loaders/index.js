"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLoaders;

var _smartHelper = require("../../share/smartHelper");

var _styleLoader = require("./styleLoader");

var _assetsLoader = require("./assetsLoader");

var _transpilingLoader = require("./transpilingLoader");

function getLoaders(type, sType, base64Limit, include) {
  // include = include ? include.map(s => PROJECT_ROOT_PATH + '/' + s) : [];
  const isDev = (0, _smartHelper.isDevMode)();
  return [...(0, _transpilingLoader.getTranspilingLoader)(isDev, type, sType), ...(0, _styleLoader.getStyleLoader)(isDev), ...(0, _assetsLoader.getAssetsLoader)(isDev, base64Limit)].map(rule => ({ ...rule,
    exclude: [// \\ for Windows, / for macOS and Linux
    /node_modules[\\/]core-js/, /node_modules[\\/]webpack[\\/]buildin/, /bower_components/],
    include // include: [
    //   /*PROJECT_ROOT_PATH + '/src',
    //   PROJECT_ROOT_PATH + '/index.jsx',
    //   PROJECT_ROOT_PATH + '/index.tsx',
    //   PROJECT_ROOT_PATH + '/index.js',
    //   PROJECT_ROOT_PATH + '/index.ts',
    //   ...(include as string[]),*/
    // ],

  }));
}

module.exports = exports.default;