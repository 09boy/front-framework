"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonPlugins = getCommonPlugins;

var _webpackHelper = require("../../share/webpackHelper");

var _webpack = require("webpack");

function getCommonPlugins(isDevMode, mode, provide) {
  const items = [];
  items.push(new _webpack.SourceMapDevToolPlugin({
    // filename[error]: https://github.com/webpack/webpack/issues/9732
    filename: isDevMode ? '[file].js.map[query]' : 'sourcemaps/[name].[contenthash].map',
    exclude: ['node_modules']
  }));
  const defineVars = {
    'process.env.NODE_ENV': isDevMode ? 'development' : 'production',
    'process.env.DEBUG': isDevMode,
    //   __VUE_OPTIONS_API__: false,
    //   __VUE_PROD_DEVTOOLS__: false,
    ...(0, _webpackHelper.getGlobalEnvVar)(mode)
  };
  const defineOption = {};

  for (const key in defineVars) {
    if (Object.hasOwnProperty.call(defineVars, key)) {
      const value = defineVars[key];
      defineOption[key] = typeof value === 'boolean' ? value : JSON.stringify(value);
    }
  }

  items.push(new _webpack.DefinePlugin(defineOption));

  if (provide) {
    const provideData = {};

    for (const key in provide) {
      if (Object.hasOwnProperty.call(provide, key)) {
        provideData[key] = provide[key];
      }
    }

    items.push(new _webpack.ProvidePlugin(provideData));
  }

  return items;
}