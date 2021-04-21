"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileLoader = getFileLoader;

var _tool = require("../tool");

const isJPGReg = /\.(jpe?g)$/i;
const isPngRef = /\.(png)$/i;

function getFileLoader(env, staticPath, maxSize) {
  const envModel = (0, _tool.isDevEnv)(env);
  const name = envModel ? '[name][ext][query]' : '[contenthash][ext][query]';
  const dataUrlCondition = {
    maxSize
  };
  const rules = [{
    test: /\.(png|jpe?g|gif|pdf)$/i,
    type: 'asset',
    generator: {
      filename: `${staticPath}images/${name}`
    },
    parser: {
      dataUrlCondition
    }
  }, {
    test: /\.(mp4|mov|wmv|flv)$/i,
    type: 'asset',
    generator: {
      filename: `${staticPath}media/${name}`
    }
  }, {
    test: /\.(woff|woff2|eot|ttf|otf|tiff)$/i,
    type: 'asset/resource',
    generator: {
      filename: `${staticPath}fonts/${name}`
    }
  }, {
    test: /\.(svg)$/i,
    type: 'asset',
    generator: {
      filename: `${staticPath}svgs/${name}`
    },
    parser: {
      dataUrlCondition
    }
  }];

  if (!envModel) {
    /*rules.push({
      test:  /\.(gif|png|jpe?g|svg)$/i,
      loader: getDynamicModule('file-loader'),
      options: {
        name,
        outputPath: `images`,
        publicPath: staticPath,
      },
    })*/

    /*rules.push(
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: getDynamicModule('file-loader'),
            options: {
              outputPath: `${staticPath}/images`,
            },
          },
          {
            loader: getDynamicModule('image-webpack-loader'),
            options: {
              disable: false,
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              webp: {
                quality: 75
              }
            }
          }
        ],
      }
    );*/
  }

  return rules;
}