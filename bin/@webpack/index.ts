import { Configuration } from 'webpack';
import { EnvModeType, SmartConfigData } from 'types/SmartType';
import { getAlias, getExtensions, parseConfigData } from 'share/webpackHelper';
import { PROJECT_ROOT_PATH } from 'share/path';
import { isDevMode } from 'share/smartHelper';
import { getWebpackEntryAndOutputConfiguration } from './entryAndOutput';
import getLoaders from './loaders';
import getPlugins from './plugins';
import getOptimizationConfig from './optimization';

export default function webpackConfiguration(data: SmartConfigData): Configuration {
  if (process.env.NODE_ENV === 'production' && process.env.buildData) {
    data = JSON.parse(process.env.buildData) as SmartConfigData;
  }
  const { entryAndOutput, plugins, type, scriptType } = parseConfigData(data);
  const isDev = isDevMode();
  const envMode = process.env.__MODE__ as EnvModeType;

  return {
    name: 'smart',
    context: PROJECT_ROOT_PATH,
    mode: isDev ? 'development' : 'production',
    devtool: false, // use SourceMapDevToolPlugin
    target: 'web', // default is web, you can set 'node'
    plugins: getPlugins(plugins),
    module: {
      rules:  getLoaders(type, scriptType, data.base64Limit),
    },
    resolve: {
      alias: getAlias(data.alias),
      extensions: getExtensions(type, scriptType),
    },
    ...getWebpackEntryAndOutputConfiguration({ ...entryAndOutput, isDevMode: isDev }),
    // in webpack 5
    // experiments: {
    //   futureDefaults: true,
    // },
    optimization: getOptimizationConfig(envMode, type),
    performance: {
      maxAssetSize: type === 'normal' ? 100000 : 200000,
      maxEntrypointSize: type === 'normal' ? 200000 : 300000
    }
  };
}