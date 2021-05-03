import { EnvModeType } from './Smart';

export type ProjectType = 'normal' | 'react' | 'vue' | 'nodejs' | 'miniProgram';
export type ScriptType = 'js' | 'ts';

export interface SmartEntryOption {
  [key: string]: {
    path: string;
    favicon?: string;
    title?: string;
  }
}

export interface SmartStructureOption {
  src: string;
  pages: string;
  assets: string;
  app?: string;
  components?: string;
}

export interface SmartConfigOption {
  host: string;
  port: number;
  entry: SmartEntryOption;
  buildDir: string;
  publicPath: string;
  devtool?: string;
  base64Limit?: number;
  loaderIncludes?: string[];
  vendors?: Record<string, string[]>;
  structure: SmartStructureOption;
  provide?: Record<string, any>;
  resolveAlias?: Record<string, any>;
  mode: {
    [key in keyof EnvModeType]: string;
  };
}

export type PackageData = Record<string, {
  smart: {
    projectType: ProjectType;
    scriptType: ScriptType;
  },
  [key: string]: string | any[] | Record<string, any>;
}>;
