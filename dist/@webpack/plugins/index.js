"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPlugins;

var _smartHelper = require("../../share/smartHelper");

var _htmlPlugin = require("./htmlPlugin");

var _stylePlugin = require("./stylePlugin");

var _commonPlugin = require("./commonPlugin");

var _developmentPlugin = require("./developmentPlugin");

var _productionPlugin = require("./productionPlugin");

function getPlugins({
  entryPath,
  publicPath,
  favicon,
  title,
  globalVar,
  provide,
  eslintEnabled
}) {
  const isDev = (0, _smartHelper.isDevMode)();
  return [(0, _htmlPlugin.getHtmlPlugin)(publicPath, entryPath, isDev, title, favicon), ...(0, _stylePlugin.getStylePlugin)(isDev), ...(0, _commonPlugin.getCommonPlugins)(isDev, globalVar, provide), ...(0, _developmentPlugin.getDevelopmentPlugins)(isDev, eslintEnabled), ...(0, _productionPlugin.getProductionPlugins)(isDev)];
}

module.exports = exports.default;