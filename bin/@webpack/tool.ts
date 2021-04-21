import { EnvType } from 'types/EnvType';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';
import { SmartConfigType } from 'types/SmartConfigType';
import { EntryAndOutputOptionsType } from '@webpack/entryAndOutput';
import { getLogErrorStr } from 'share/log';
import { PROJECT_ROOT_PATH } from 'share/path';
import { getDynamicModule } from 'share/tool';

export function isDevEnv(env: EnvType): boolean {
  return env === 'development' || env === 'start';
}

export function parseConfigData(env: EnvType, config: SmartConfigType) {
  if (process.env.BuildConfig) {
    config = JSON.parse(process.env.BuildConfig);
    env = config?.env as EnvType;
  }

  const devMode = isDevEnv(env);
  let { name, port, host, projectType, structure, entry, vendors, devtool, publicPath, buildDir, provide, resolveAlias, scriptingLanguageType, base64Limit } = config;
  const projectLanguageType: ProjectLanguageType = scriptingLanguageType || ProjectLanguageType.Javascript;

  name = name || 'Smart App';
  projectType = projectType as ProjectType || 'normal';
  port = port || 3000;
  host = host || '127.0.0.1';
  devtool = devMode ? devtool || 'inline-source-map' : 'source-map';
  publicPath = publicPath || '/';
  buildDir = PROJECT_ROOT_PATH + '/' + (buildDir || 'dist');


  if (vendors && typeof vendors === 'object' && Array.isArray(vendors)) {
    throw new Error(getLogErrorStr('"vendors" is not valid object.'));
  }

  if (!structure) {
    throw new Error(getLogErrorStr('"structure" is error.'));
  }

  resolveAlias = { ...resolveAlias };
  const copyStructure: Record<string, any> = { ...structure };
  for (const key in copyStructure) {
    if (copyStructure.hasOwnProperty(key)) {
      const value = copyStructure[key];
      if (key !== 'src' && value) {
        resolveAlias[key] = PROJECT_ROOT_PATH + '/' + copyStructure.src + '/' + value;
      }
    }
  }

  const htmlEntryFiles: Record<string, any> = {};
  for (let key in entry) {
    if (entry.hasOwnProperty(key)) {
      htmlEntryFiles[key] = {
        ...entry[key],
        favicon: structure.src + '/' + structure.assets + '/' + entry[key].favicon,
      };
    }
  }

  const pluginsProps = {
    devMode,
    projectType,
    publicPath,
    provide,
    projectLanguageType,
    entryFiles: htmlEntryFiles
  };

  const loadersProps = {
    env,
    projectType,
    projectLanguageType,
    structure,
    maxSize: base64Limit || 8192,
  };

  const entryOutOption: EntryAndOutputOptionsType = {
    env,
    name,
    port,
    host,
    projectType,
    entryFiles: entry,
    publicPath,
    buildPath: buildDir,
  };

  const performance: boolean | Record<string, any> = devMode ? false : {
    hints: 'warning',
    maxEntrypointSize: 400000,
    maxAssetSize: 307200,
    assetFilter: (filename: string) => !(/\.(mp4|mov|wmv|flv)$/i.test(filename)),
  };

  return {
    name,
    structure,
    entryOutOption,
    devtool,
    vendors,
    target: devMode ? 'web' : 'browserslist',
    publicPath,
    devMode,
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
