import { SmartWebpackOption } from 'types/Smart';
import { SmartEntryOption } from 'types/SmartProjectConfig';
import { EntryAndOutputOptionsType } from '@webpack/entryAndOutput';
import { getLogErrorStr } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import { isDevEnv } from 'share/env';
import { PluginProps } from './plugins';
import { LoaderProps } from './loaders';
import { OptimizationConfigType } from './optimization';
import { getResolveAlias, getResolveExtensions } from "share/webpackHelper";

type Value = {
  devMode: boolean;
  name: string;
  entryOutOption: EntryAndOutputOptionsType;
  devtool: string;
  target: string;
  publicPath: string;
  pluginsProps: PluginProps;
  loadersProps: LoaderProps;
  performance: undefined | Record<string, any>;
  resolveAlias: Record<string, any>;
  resolveExtensions: string[];
  optimization: OptimizationConfigType;
};

export function parseConfigData({ projectOption, configOption }: SmartWebpackOption): Value {
  const devMode = isDevEnv();
  const { projectType, name, scriptType, modeType } = projectOption;

  const { port, host, base64Limit, entry, devtool, vendors, provide, structure, mode } = configOption;
  const publicPath = configOption.publicPath || '/';
  const buildDir = PROJECT_ROOT_PATH + '/' + (configOption.buildDir || 'dist');

  if (vendors && !(Object.prototype.toString.call(vendors) === '[object Object]' || Array.isArray(vendors))) {
    throw new Error(getLogErrorStr('"vendors" is not valid object.'));
  }

  if (!structure) {
    throw new Error(getLogErrorStr('"structure" is error.'));
  }

  const htmlEntryFiles: SmartEntryOption = {};
  const imagePath = typeof structure.assets === 'string' ? structure.assets : 'assets';
  for (const key in entry) {
    if (Object.hasOwnProperty.call(entry, key)) {
      htmlEntryFiles[key] = {
        ...entry[key],
        favicon: entry[key]?.favicon ? `${structure.src}/${imagePath}/${entry[key].favicon as string}` : undefined,
      };
    }
  }

  console.log('htmlEntryFiles::', htmlEntryFiles);

  const pluginsProps = {
    projectOption,
    publicPath,
    provide,
    modeOption: mode,
    entryFiles: htmlEntryFiles
  };

  const loadersProps = {
    projectOption,
    structure,
    maxSize: base64Limit || 8192,
  };

  const entryOutOption: EntryAndOutputOptionsType = {
    devMode,
    name,
    port,
    host,
    projectType,
    entryFiles: entry,
    publicPath,
    buildPath: buildDir,
  };

  const performance: undefined | Record<string, any> = devMode ? undefined : {
    hints: 'warning',
    maxEntrypointSize: 400000,
    maxAssetSize: 307200,
    assetFilter: (filename: string) => !(/\.(mp4|mov|wmv|flv)$/i.test(filename)),
  };

  return {
    devMode,
    name,
    entryOutOption,
    devtool: devMode ? devtool || 'inline-source-map' : 'source-map',
    target: devMode ? 'web' : 'browserslist',
    publicPath,
    pluginsProps,
    loadersProps,
    performance,
    resolveAlias: getResolveAlias(projectType, structure.src),
    resolveExtensions: getResolveExtensions(projectType, scriptType),
    optimization: {
      devMode,
      modeType,
      vendors,
    },
  };
}
