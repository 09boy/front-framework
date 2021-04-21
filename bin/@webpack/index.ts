import { Configuration } from 'webpack';
import { SmartConfigType } from 'types/SmartConfigType';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { EnvType } from 'types/EnvType';
import { getWebpackEntryAndOutputConfiguration } from './entryAndOutput';
import { parseConfigData } from './tool';
import getLoaders from './loaders';
import getPlugins from './plugins';
import getOptimizationConfig from './optimization';


export default function configuration(env: EnvType = 'start', config: SmartConfigType):Configuration {
  const { name, target, vendors, devMode, devtool, entryOutOption, pluginsProps, loadersProps, resolveAlias, performance } = parseConfigData(env, config);

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
      rules: getLoaders(loadersProps, config?.loaderIncludes),
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
    optimization: getOptimizationConfig(devMode, vendors),
    stats: {
      cached: true,
      cachedAssets: true,
      cachedModules: true,
    },
    performance,
  };
}
