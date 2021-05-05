import { Configuration } from 'webpack';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { SmartWebpackOption } from 'types/Smart';
import { getWebpackEntryAndOutputConfiguration } from './entryAndOutput';
import { parseConfigData } from './tool';
import getLoaders from './loaders';
import getPlugins from './plugins';
import getOptimizationConfig from './optimization';


export default function configuration(option: SmartWebpackOption):Configuration {
  if (process.env.BuildConfig) {
    option = JSON.parse(process.env.BuildConfig) as SmartWebpackOption;
  }
  const { devMode, name, target, devtool, entryOutOption, pluginsProps, loadersProps, resolveAlias, performance } = parseConfigData(option);

  return {
    name,
    context: PROJECT_ROOT_PATH,
    ...getWebpackEntryAndOutputConfiguration(entryOutOption),

    //issue: target HRM: https://github.com/webpack/webpack-dev-server/issues/2758
    target,
    mode: devMode ? 'development' : 'production',
    devtool,
    module: {
      unsafeCache: true,
      rules: getLoaders(loadersProps, option.configOption?.loaderIncludes),
      /*parser: {
        javascript: {
          commonjsMagicComments: true,
          url: 'relative'
        },
      },*/
    },
    plugins: getPlugins(pluginsProps),
    resolve: {
      alias: resolveAlias,
      preferRelative: true,
      symlinks: true,
      roots: [PROJECT_ROOT_PATH],
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.less', '.mjs'],
    },
    resolveLoader: { //
      modules: [`${SMART_ROOT_PATH}/node_modules`],
      extensions: ['.js', '.json'],
    },
    optimization: getOptimizationConfig(devMode, option.projectOption.modeType,  option.configOption.vendors),
    stats: {
      cached: true,
      cachedAssets: true,
      cachedModules: true,
    },
    performance,
  };
}
