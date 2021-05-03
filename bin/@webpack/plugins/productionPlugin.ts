import { WebpackPluginInstance, ProgressPlugin, ids, BannerPlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { getDynamicModule } from 'share/projectHelper';
import { isDevEnv } from 'share/env';

export function getProductionPlugins(): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  if (devMode) {
    return [];
  }

  return [
    new ProgressPlugin({ percentBy: 'entries' }),
    new CleanWebpackPlugin(),
    new BannerPlugin({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      banner: `fullhash:[fullhash], chunkhash:[chunkhash], name:[name], base:[base], query:[query], file:[file], @author: 09boy- ${new Date()}`,
      entryOnly: false,
      exclude: /\/node_modules/
    }),
    new ids.DeterministicModuleIdsPlugin({
      maxLength: 5,
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/i,
      threshold: 10240,
      minRatio: 0.8,
    }) as unknown as WebpackPluginInstance,
    new ImageMinimizerPlugin({
      exclude: /\/node_modules/,
      loader: false,
      severityError: false,
      minimizerOptions: {
        plugins: [
          [getDynamicModule('imagemin-gifsicle'), { interlaced: true }],
          [getDynamicModule('imagemin-jpegtran'), { progressive: true }],
          [getDynamicModule('imagemin-optipng'), { optimizationLevel: 5 }],
          [getDynamicModule('imagemin-svgo'), {
            /*plugins: [
              {removeViewBox: false,}
            ],*/
          }]
        ],
      },
    }),
    // new BundleAnalyzerPlugin(),
  ];
}
