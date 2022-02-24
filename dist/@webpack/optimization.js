"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOptimizationConfig;

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _cssMinimizerWebpackPlugin = _interopRequireDefault(require("css-minimizer-webpack-plugin"));

var _imageMinimizerWebpackPlugin = _interopRequireDefault(require("image-minimizer-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptimizationConfig(modeType, type
/*vendors?: Record<string, string[]> | string[]*/
) {
  let option = {
    chunkIds: 'named'
  };
  const isDevMode = modeType === 'start';

  if (!isDevMode) {
    // const drop_console = modeType === 'release';
    const cacheGroups = {// styles: {
      //   name: 'styles',
      //   type: 'css/mini-extract',
      //   // test: /\.css$/,
      //   chunks: 'all',
      //   enforce: true,
      //   priority: 20,
      // }
    };

    if (type === 'react') {
      cacheGroups['reactVendor'] = {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react-vendor'
      };
    } // config


    option = {
      // chunkIds: 'named',
      // chunkIds: true, // if false use webpack.ids.DeterministicChunkIdsPlugin to set
      // usedExports: true,
      runtimeChunk: true,
      minimizer: ['...', // '...' can be used in optimization.minimizer to access the defaults.
      new _cssMinimizerWebpackPlugin.default(), new _terserWebpackPlugin.default({
        test: /\.js(\?.*)?$/i,
        parallel: true
      }), new _imageMinimizerWebpackPlugin.default({
        minimizer: {
          implementation: _imageMinimizerWebpackPlugin.default.squooshMinify,
          options: {
            plugins: [// ['mozjpeg', { progressive: true }]
            'mozjpeg', 'optipng', 'gifsicle', 'svgo'] // use default config
            // encodeOptions: {
            //   mozjpeg: {
            //     quality: 75
            //   },
            //   optipng: {
            //     optimizationLevel: 5
            //   },
            //   webp: {
            //     lossless: 1,
            //   },
            //   avif: {
            //     cqLevel: 0,
            //   }
            // }

          }
        }
      })],
      splitChunks: {
        chunks: 'all',
        name: isDevMode,
        cacheGroups
      }
    };
  }

  return option;
}

module.exports = exports.default;