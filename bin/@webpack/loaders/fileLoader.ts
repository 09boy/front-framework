import { RuleSetRule } from 'webpack';
import { isDevEnv } from 'share/env';
import { getDynamicModule } from 'share/projectHelper';
import { SmartStructureOption } from "types/SmartProjectConfig";
import { getAssetsPath } from "share/webpackHelper";

/*const isJPGReg = /\.(jpe?g)$/i;
const isPngRef = /\.(png)$/i;*/

export function getFileLoader(structure: SmartStructureOption, maxSize: number): RuleSetRule[] {
  const { assetsPath, imagePath, svgPath, fontsPath, mediasPath } = getAssetsPath(structure);


  const devModel = isDevEnv();
  const name = devModel ? '[name][ext][query]' : '[contenthash][ext][query]';
  const dataUrlCondition = {
    maxSize,
  };

  const rules: RuleSetRule[] = [
    {
      test: /\.(png|jpe?g|gif|pdf)$/i,
      type: 'asset/resource',
      generator: {
        filename: `${imagePath || assetsPath}/${name}`,
      },
      parser: {
        dataUrlCondition,
      },
    },
    {
      test: /\.(mp4|mov|wmv|flv)$/i,
      type: 'asset/resource',
      generator: {
        filename: `${mediasPath || assetsPath}/${name}`,
      }
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf|tiff)$/i,
      type: 'asset/resource',
      generator: {
        filename: `${fontsPath || assetsPath}/${name}`,
      }
    },
    {
      test: /\.(svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: `${svgPath || assetsPath}/${name}`,
      },
      parser: {
        dataUrlCondition,
      }
    },
  ];

  if (!devModel) {
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
