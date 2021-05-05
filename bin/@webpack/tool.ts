import { SmartWebpackOption } from 'types/Smart';
import { SmartEntryOption } from 'types/SmartProjectConfig';
import { EntryAndOutputOptionsType } from '@webpack/entryAndOutput';
import { getLogErrorStr } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import { getDynamicModule } from 'share/projectHelper';
import { isDevEnv } from 'share/env';
import { PluginProps } from '@webpack/plugins';
import { LoaderProps } from '@webpack/loaders';

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
};

export function parseConfigData({ projectOption, configOption }: SmartWebpackOption): Value {

  const devMode = isDevEnv();
  const { projectType, name } = projectOption;

  const { port, host, base64Limit, entry, devtool, vendors, provide, structure, mode } = configOption;
  const publicPath = configOption.publicPath || '/';
  const buildDir = PROJECT_ROOT_PATH + '/' + (configOption.buildDir || 'dist');

  if (vendors && typeof vendors === 'object' && Array.isArray(vendors)) {
    throw new Error(getLogErrorStr('"vendors" is not valid object.'));
  }

  if (!structure) {
    throw new Error(getLogErrorStr('"structure" is error.'));
  }

  const resolveAlias = { ...configOption.resolveAlias };
  const copyStructure: Record<string, string> = { ...structure };
  for (const key in copyStructure) {
    if (Object.hasOwnProperty.call(copyStructure, key)) {
      const value = copyStructure[key];
      if (key !== 'src' && value) {
        resolveAlias[key] = `${PROJECT_ROOT_PATH}/${copyStructure.src}/${value}`;
      }
    }
  }

  const htmlEntryFiles: SmartEntryOption = {};
  for (const key in entry) {
    if (Object.hasOwnProperty.call(entry, key)) {
      htmlEntryFiles[key] = {
        ...entry[key],
        favicon: entry[key]?.favicon ? `${structure.src}/${structure.assets}/${entry[key].favicon as string}` : undefined,
      };
    }
  }

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
    resolveAlias: {
      '@babel/runtime-corejs3': getDynamicModule('@babel/runtime-corejs3'),
      'react': PROJECT_ROOT_PATH + '/node_modules/react',
      '@hot-loader/react-dom': PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
      'react-dom': PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
      ...resolveAlias,
    },
  };
}
