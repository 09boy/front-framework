"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProductionPlugins = getProductionPlugins;

var _webpack = require("webpack");

var _cleanWebpackPlugin = require("clean-webpack-plugin");

var _compressionWebpackPlugin = _interopRequireDefault(require("compression-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProductionPlugins(isDevMode) {
  if (isDevMode) {
    return [];
  }

  return [// new ProgressPlugin({ percentBy: 'entries' }),
  new _cleanWebpackPlugin.CleanWebpackPlugin(), new _webpack.BannerPlugin({
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    banner: `fullhash:[fullhash], chunkhash:[chunkhash], name:[name], base:[base], query:[query], file:[file], @author: 09boy- ${new Date()}`,
    entryOnly: false,
    exclude: /\/node_modules/
  }), // for caching
  new _webpack.ids.DeterministicModuleIdsPlugin({
    maxLength: 5
  }), new _compressionWebpackPlugin.default({
    filename: '[path][base].gz',
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/i,
    threshold: 10240,
    minRatio: 0.8
  }) // new ImageMinimizerPlugin(
  //   {
  //     minimizerOptions: {
  //       plugins: [
  //             'imagemin-gifsicle',
  //             // 'imagemin-mozjpeg',
  //             'imagemin-pngquant',
  //             // getDynamicModule('imagemin-gifsicle'),
  //             // getDynamicModule('imagemin-mozjpeg'),
  //             // getDynamicModule('imagemin-pngquant')
  //           ],
  //     }
  //   }
  // )
  // new ImageMinimizerPlugin({
  //   exclude: /\/node_modules/,
  //   loader: false,
  //   severityError: false,
  //   minimizerOptions: {
  //     plugins: [
  //       [getDynamicModule('imagemin-gifsicle'), { interlaced: true }],
  //       [getDynamicModule('imagemin-jpegtran'), { progressive: true }],
  //       [getDynamicModule('imagemin-optipng'), { optimizationLevel: 5 }],
  //       // getDynamicModule('imagemin-svgo'),
  //     ],
  //   },
  // }),
  // new BundleAnalyzerPlugin(),
  ];
}