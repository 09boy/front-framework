"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPlugins;

var _htmlPlugin = require("./htmlPlugin");

var _stylePlugin = require("./stylePlugin");

var _commonPlugin = require("./commonPlugin");

var _developmentPlugin = require("./developmentPlugin");

var _productionPlugin = require("./productionPlugin");

function getPlugins({
  devMode,
  entryFiles,
  publicPath,
  provide,
  projectType,
  projectLanguageType
}) {
  return [...(0, _stylePlugin.getStylePlugin)(devMode), ...(0, _htmlPlugin.getHtmlPlugin)(devMode, publicPath, entryFiles), ...(0, _commonPlugin.getCommonPlugins)(devMode, provide), ...(0, _developmentPlugin.getDevelopmentPlugins)(devMode, projectType, projectLanguageType), ...(0, _productionPlugin.getProductionPlugins)(devMode)];
}

module.exports = exports.default;