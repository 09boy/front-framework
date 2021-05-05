import { EntryNormalized, Template } from 'webpack';
import TerserPlugin  from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { EnvModeType } from 'types/Smart';

export default function getOptimizationConfig(devMode: boolean, modeType: EnvModeType , vendors?: Record<string, string[]>): Template {
  let option: Template = {
    chunkIds: 'named',
  };

  if (!devMode) {
    const drop_console = modeType === 'release';

    const cacheGroups: Record<string, any> = {
      async: {
        chunks: 'async',
        priority: 19,
      },
      // common chunk
      common: {
        chunks: 'initial',
        minChunks: 2,
      },

      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -20,
        minChunks: 2,
        reuseExistingChunk: true,
      },
      styles: {
        name: 'styles',
        type: 'css/mini-extract',
        // test: /\.css$/,
        chunks: 'all',
        enforce: true,
        priority: 20,
      }
    };

    if (vendors) {
      let priority = 10;
      for (const key in vendors) {
        if (Object.hasOwnProperty.call(vendors, key)) {
          const value: string[] = vendors[key];
          const reg = value.join('|');
          cacheGroups[key] = {
            name: key,
            test: new RegExp(`[\\/]node_modules[\\/](${reg})`),
            chunks: 'all',
            priority,
          };
          priority ++;
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
      minimizer: [
        '...',
        new TerserPlugin({
          parallel: true,
          extractComments: true,
          exclude: /\/node_modules/,
          terserOptions: {
            compress: {
              drop_console,
            },
            format: {
              comments: false,
            },
          },
        }),
        new CssMinimizerPlugin({
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: drop_console },
              },
            ],
          },
        }),
      ],

      /*runtimeChunk: {
        name: (entryPoint: any) => `runtimeChunk~${entryPoint.name}`,
      },*/

      splitChunks: { // default
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 2000,
        maxSize: 40000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups,
      },
    };
  }
  return option;
}
