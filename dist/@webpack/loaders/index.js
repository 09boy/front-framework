"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLoaders;

var _styleLoader = require("./styleLoader");

var _fileLoader = require("./fileLoader");

var _templatingLoader = require("./templatingLoader");

var _transpilingLoader = require("./transpilingLoader");

var _path = require("../../share/path");

function getLoaders({
  env,
  projectType,
  projectLanguageType,
  structure,
  maxSize
}, include = []) {
  const {
    assets,
    src
  } = structure;
  const staticPath = assets + '/';
  include = include.map(s => _path.PROJECT_ROOT_PATH + '/' + s);
  return [...(0, _transpilingLoader.getTranspilingLoader)(env, projectType, projectLanguageType), ...(0, _templatingLoader.getTemplatingLoader)(), ...(0, _styleLoader.getStyleLoader)(env), ...(0, _fileLoader.getFileLoader)(env, staticPath, maxSize)].map(rule => ({ ...rule,
    exclude: [// \\ for Windows, / for macOS and Linux
    /node_modules[\\/]core-js/, /node_modules[\\/]webpack[\\/]buildin/, /bower_components/],
    include: [_path.PROJECT_ROOT_PATH + '/' + src, _path.PROJECT_ROOT_PATH + '/index.js', _path.PROJECT_ROOT_PATH + '/index.ts', ...include]
  }));
}

module.exports = exports.default;