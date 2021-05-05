"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProductionPlugins = getProductionPlugins;

var _webpack = require("webpack");

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _compressionWebpackPlugin = _interopRequireDefault(require("compression-webpack-plugin"));

var _imageMinimizerWebpackPlugin = _interopRequireDefault(require("image-minimizer-webpack-plugin"));

var _projectHelper = require("../../share/projectHelper");

var _env = require("../../share/env");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
function getProductionPlugins() {
  const devMode = (0, _env.isDevEnv)();

  if (devMode) {
    return [];
  }

  return [// new ProgressPlugin({ percentBy: 'entries' }),
  new _cleanWebpackPlugin.CleanWebpackPlugin(), new _webpack.BannerPlugin({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
      plugins: [[(0, _projectHelper.getDynamicModule)('imagemin-gifsicle'), {
        interlaced: true
      }], [(0, _projectHelper.getDynamicModule)('imagemin-jpegtran'), {
        progressive: true
      }], [(0, _projectHelper.getDynamicModule)('imagemin-optipng'), {
        optimizationLevel: 5
      }], [(0, _projectHelper.getDynamicModule)('imagemin-svgo'), {
        /*plugins: [
          {removeViewBox: false,}
        ],*/
      }]]
    }
  }) // new BundleAnalyzerPlugin(),
  ];
}