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
  projectOption,
  provide,
  entryFiles,
  publicPath
}) {
  return [...(0, _stylePlugin.getStylePlugin)(), ...(0, _htmlPlugin.getHtmlPlugin)(publicPath, entryFiles), ...(0, _commonPlugin.getCommonPlugins)(provide), ...(0, _developmentPlugin.getDevelopmentPlugins)(projectOption), ...(0, _productionPlugin.getProductionPlugins)()];
}

module.exports = exports.default;