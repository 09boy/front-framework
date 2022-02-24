import { Template } from 'webpack';
import TerserPlugin  from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { EnvModeType, ProjectType } from 'types/SmartType';

export default function getOptimizationConfig(modeType: EnvModeType, type: ProjectType, /*vendors?: Record<string, string[]> | string[]*/): Template {
  let option: Template = {
    chunkIds: 'named',
  };

  const isDevMode = modeType === 'start';

  if (!isDevMode) {
    // const drop_console = modeType === 'release';

    const cacheGroups: Record<string, any> = {
      // styles: {
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
    }

    // config
    option = {
      // chunkIds: 'named',
      // chunkIds: true, // if false use webpack.ids.DeterministicChunkIdsPlugin to set
      // usedExports: true,
      runtimeChunk: true,
      minimizer: [
        '...', // '...' can be used in optimization.minimizer to access the defaults.
        new CssMinimizerPlugin(),
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
          parallel: true,
        }),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.squooshMinify as unknown,
            options: {
              plugins: [
                // ['mozjpeg', { progressive: true }]
                'mozjpeg',
                'optipng',
                'gifsicle',
                'svgo',
              ], // use default config
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
        } as Record<string, any>),
      ],
      splitChunks: {
        chunks: 'all',
        name: isDevMode,
        cacheGroups,
      },
    };
  }

  return option;
}
