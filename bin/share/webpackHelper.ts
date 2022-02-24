import { existsSync } from 'fs';
import { PROJECT_ROOT_PATH } from 'share/path';
import { ProjectType, ScriptType, SmartConfigData } from 'types/SmartType';
import { EntryAndOutputOptions, PluginOptions } from 'types/WebpackType';

// function getEntryFilePath(sType: ScriptType): string {
//   let path;
//   if (existsSync(`${PROJECT_ROOT_PATH}/index.js`)) {
//     path = `${PROJECT_ROOT_PATH}/index.js`;
//   } else if (existsSync(`${PROJECT_ROOT_PATH}/index.ts`)) {
//     path = `${PROJECT_ROOT_PATH}/index.ts`;
//   } else {
//     path = `${PROJECT_ROOT_PATH}/index.${sType}`;
//     writeFileSync(path, '', 'utf-8');
//   }
//   return path;
// }

function getEntryAndOutData(scriptType: ScriptType, type: ProjectType, port: number,  host = '127.0.0.1', publicPath = '/', buildDir = '/dist'): EntryAndOutputOptions {
  return {
    entryPath: `${PROJECT_ROOT_PATH}/index`,
    isDevMode: true,
    projectType: type,
    host,
    port,
    publicPath,
    buildPath: buildDir.includes('/') ? `${PROJECT_ROOT_PATH}${buildDir}` : `${PROJECT_ROOT_PATH}/${buildDir}`,
    name: 'smart-app',
  };
}

function getPluginsData(entryPath: string, publicPath = '/', title?: string, favicon?: string, globalVar?: Record<string, any>, provide?: Record<string, string>, eslintEnabled?: boolean): PluginOptions {
  return {
    entryPath,
    publicPath,
    title,
    favicon: favicon ? PROJECT_ROOT_PATH + '/src/assets/' + favicon : undefined,
    globalVar,
    provide,
    eslintEnabled: !!eslintEnabled,
  };
}

type Data = {
  entryAndOutput: EntryAndOutputOptions;
  plugins: PluginOptions;
  type: ProjectType;
  scriptType: ScriptType;
};

export function parseConfigData(data: SmartConfigData): Data {
  const { scriptType, type, host, port, publicPath, buildDir, favicon, globalVar, provide, eslintEnabled } = data;

  const entryAndOutput = getEntryAndOutData(scriptType, type, port, host, publicPath, buildDir);

  return {
    type,
    scriptType,
    entryAndOutput,
    plugins: getPluginsData(entryAndOutput.entryPath, publicPath, undefined, favicon, globalVar, provide, eslintEnabled),
  };
}

export function getAlias(alias?: Record<string, string>): Record<string, string> {
  if (!alias) {
    return {
      src: `${PROJECT_ROOT_PATH}/src/`,
      assets: `${PROJECT_ROOT_PATH}/src/assets/`,
      pages: `${PROJECT_ROOT_PATH}/src/pages/`,
    };
  }

  const root = `${PROJECT_ROOT_PATH}/${  alias.root? alias.root.replace(/\//g, '') : 'src' }`;
  const obj: Record<string, string> = {
    src: root,
  };

  for (const key in alias) {
    if (key !== 'root' && Object.hasOwnProperty.call(alias, key)) {
      const value = alias[key] || key;
      obj[key] = `${root}/${value}/`;
    }
  }

  return obj;
}

export function getExtensions(type: ProjectType, sType: ScriptType): string[] {
  const files: string[] = ['.js', '.jsx', '.json', '.css', '.scss', '.less'];
  const isTs = sType === 'ts';

  if (isTs) {
    files.push('.ts', '.tsx');
  }

  // default extensions
  files.push('...');
  return files;
}

export function getGlobalEnvVar(mode?: Record<string, any>): Record<string, any> {
  if (!mode) {
    return {};
  }
  const modeEnv = process.env.__MODE__ || 'start';
  const envs: Record<string, any> = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    SMART_ENV: mode[modeEnv] || '//',  // parse Built-in
  };

  const customKey = `${modeEnv}-`;
  for (const key in mode) {
    if (Object.hasOwnProperty.call(mode, key)) {
      if (key.includes(customKey)) {  // parse custom
        const id = key.split('-')[1].toUpperCase();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        envs[`SMART_ENV_${id}`] = mode[key];
      }
    }
  }
  return envs;
}

export function hasBabelConfigFile(): boolean {
  return existsSync(`${PROJECT_ROOT_PATH}/babel.config.js`) || existsSync(`${PROJECT_ROOT_PATH}/babel.config.json`);
}