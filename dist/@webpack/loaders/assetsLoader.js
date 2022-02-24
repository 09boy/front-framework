"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetsLoader = getAssetsLoader;

var _smartHelper = require("../../share/smartHelper");

function getAssetsLoader(isDevMode, base64Limit) {
  const name = isDevMode ? '[name][ext]' : '[name][contenthash].[ext][query]';
  const rules = [{
    test: /\.svg$/i,
    generator: {
      filename: `assets/svgs/${name}`
    }
  }, {
    test: /\.(mp4|mov|wmv|flv)$/i,
    type: 'asset/resource',
    generator: {
      filename: `assets/medias/${name}`
    }
  }, {
    test: /\.(woff|woff2|eot|ttf|otf|tiff)$/i,
    type: 'asset/resource',
    generator: {
      filename: `assets/fonts/${name}`
    }
  }];

  if (!isDevMode) {
    rules.push({
      test: /\.(png|jpe?g|webp|gif)$/i,
      rules: [{
        loader: (0, _smartHelper.getDynamicModule)('url-loader'),
        options: {
          limit: base64Limit || Number(30720),
          outputPath: 'assets/images/'
        }
      }]
    });
  } else {
    rules.push({
      test: /\.(png|jpe?g|gif|pdf|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: `assets/images/${name}`
      }
    });
  }

  return rules;
}