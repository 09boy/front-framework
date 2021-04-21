"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProductionPlugins = getProductionPlugins;

var _webpack = require("webpack");

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _compressionWebpackPlugin = _interopRequireDefault(require("compression-webpack-plugin"));

var _imageMinimizerWebpackPlugin = _interopRequireDefault(require("image-minimizer-webpack-plugin"));

var _tool = require("../../share/tool");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProductionPlugins(devMode) {
  if (devMode) {
    return [];
  }

  return [// new ProgressPlugin({ percentBy: 'entries' }),
  new _cleanWebpackPlugin.CleanWebpackPlugin(), new _webpack.BannerPlugin({
    banner: `fullhash:[fullhash], chunkhash:[chunkhash], name:[name], base:[base], query:[query], file:[file], @author: 09boy- ${new Date()}`,
    entryOnly: false,
    exclude: /\/node_modules/
  }), new _webpack.ids.DeterministicModuleIdsPlugin({
    maxLength: 5
  }), new _compressionWebpackPlugin.default({
    filename: '[path][base].gz',
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/i,
    threshold: 10240,
    minRatio: 0.8
  }), new _imageMinimizerWebpackPlugin.default({
    exclude: /\/node_modules/,
    loader: false,
    severityError: false,
    minimizerOptions: {
      plugins: [[(0, _tool.getDynamicModule)('imagemin-gifsicle'), {
        interlaced: true
      }], [(0, _tool.getDynamicModule)('imagemin-jpegtran'), {
        progressive: true
      }], [(0, _tool.getDynamicModule)('imagemin-optipng'), {
        optimizationLevel: 5
      }], [(0, _tool.getDynamicModule)('imagemin-svgo'), {
        /*plugins: [
          {removeViewBox: false,}
        ],*/
      }]]
    }
  }) // new BundleAnalyzerPlugin(),
  ];
}