import jsYaml from 'js-yaml';
import { existsSync, readFileSync } from 'fs';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { ProjectType, SmartConfigData } from 'types/SmartType';

export const defaultDirStructure: {
  [key in ProjectType]: Record<string, string | string[]>;
} = {
  normal: {
    root: 'src',
    pages: 'pages',
    assets: ['assets',  'images'],
  },
  react: {
    root: 'src',
    pages: ['pages', 'home', 'about'],
    components:  'components',
    assets: ['assets',  'images'],
  },
  vue: {
    root: 'src',
    pages: 'pages',
    components:  'components',
    assets: ['assets',  'images'],
  },
  nodejs: {},
  miniProgram: {}
}

export function isSmartProject(): boolean {
  if (PROJECT_ROOT_PATH === SMART_ROOT_PATH) {
    throw Error('do not use "smart-cli" in framework dir');
  }
  const hastPackageFile = existsSync('package.json');
  const hasSmartConfigFile = existsSync('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

export function getDynamicModule(name: string): string {
  return `${SMART_ROOT_PATH}/node_modules/${name.trim()}`;
}

export async function getConfigData(mergeData: Record<string, any> = {}): Promise<SmartConfigData> {
  const data = await jsYaml.load(readFileSync(`${PROJECT_ROOT_PATH}/smart.config.yml`, 'utf8')) as SmartConfigData;
  return { ...data, ...mergeData };
}

export function isDevMode(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getDefaultAliasData(type: ProjectType): Record<string, string> {
  const dirStructure = defaultDirStructure[type];
  if (Object.keys(dirStructure).length > 0) {
    const alias: Record<string, string> = {};
    for (const key in dirStructure) {
      if (Object.hasOwnProperty.call(dirStructure, key)) {
        const value = dirStructure[key];
        if (typeof value === 'string') {
          alias[key] = value;
        } else {
          alias[key] = value[0];
        }
      }
    }
    return alias;
  } else {
    return {};
  }
}

/*
export function updateAliasData(type: ProjectType, alias?: Record<string,string>): void | Record<string, string> {
  const data = getDefaultAliasData(type);

  if (alias) {
    const defaultKeys = Object.keys(data);
    const newKeys = Object.keys(alias);
    if (defaultKeys.length !== newKeys.length) {
      return alias;
    }

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key) && Object.hasOwnProperty.call(alias, key)) {
        if (data[key] !== alias[key]) {
          return alias;
        }
      } else {
        return alias;
      }
    }
  }

  return data;
}*/
