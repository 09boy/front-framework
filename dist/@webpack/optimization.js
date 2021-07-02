"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getOptimizationConfig;

var _terserWebpackPlugin = _interopRequireDefault(require("terser-webpack-plugin"));

var _cssMinimizerWebpackPlugin = _interopRequireDefault(require("css-minimizer-webpack-plugin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOptimizationConfig({
  devMode,
  modeType,
  vendors
}) {
  let option = {
    chunkIds: 'named'
  };

  if (!devMode) {
    const drop_console = modeType === 'release';
    const cacheGroups = {
      async: {
        chunks: 'async',
        priority: 19
      },
      // common chunk
      common: {
        chunks: 'initial',
        minChunks: 2
      },
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -20,
        minChunks: 2,
        reuseExistingChunk: true
      },
      styles: {
        name: 'styles',
        type: 'css/mini-extract',
        // test: /\.css$/,
        chunks: 'all',
        enforce: true,
        priority: 20
      }
    };

    if (vendors) {
      let priority = 10;

      if (Array.isArray(vendors)) {
        cacheGroups['custom-vendor'] = {
          name: 'custom-vendor',
          test: new RegExp(`[\\/]node_modules[\\/](${vendors.join('|')})`),
          chunks: 'all',
          priority
        };
      } else {
        for (const key in vendors) {
          if (Object.hasOwnProperty.call(vendors, key)) {
            const value = vendors[key];
            const reg = value.join('|');
            cacheGroups[key] = {
              name: key,
              test: new RegExp(`[\\/]node_modules[\\/](${reg})`),
              chunks: 'all',
              priority
            };
            priority++;
          }
        }
      }
    }

    option = {
      emitOnErrors: true,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
      mangleWasmImports: true,
      minimize: true,
      nodeEnv: 'production',
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      minimizer: ['...', new _terserWebpackPlugin.default({
        parallel: true,
        extractComments: true,
        exclude: /\/node_modules/,
        terserOptions: {
          compress: {
            drop_console
          },
          format: {
            comments: false
          }
        }
      }), new _cssMinimizerWebpackPlugin.default({
        parallel: true,
        minimizerOptions: {
          preset: ['default', {
            discardComments: {
              removeAll: drop_console
            }
          }]
        }
      })],

      /*runtimeChunk: {
        name: (entryPoint: any) => `runtimeChunk~${entryPoint.name}`,
      },*/
      splitChunks: {
        // default
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 2000,
        maxSize: 40000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups
      }
    };
  }

  return option;
}

module.exports = exports.default;