import { EnvModeType } from './Smart';

export type ProjectType = 'normal' | 'react' | 'vue' | 'nodejs' | 'miniProgram';
export type ScriptType = 'js' | 'ts';
export type AssetsType = 'images' | 'fonts' | 'styles' | 'media' | 'svg';

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
  components?: string;
  assets: string | {[key in AssetsType]?: string};
  app?: string | {[key: string]: string};
  routes?: string;
  server?: string;
}

export interface SmartModeOption {
  [key: string]: {
    [ k in EnvModeType ]: string;
  };
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
  vendors?: Record<string, string[]> | string[];
  structure: SmartStructureOption;
  provide?: Record<string, any>;
  // resolveAlias?: Record<string, any>;
  mode: SmartModeOption;
}

export type PackageData =  {
  name: string;
  version: string;
  smart: {
    projectType: ProjectType;
    scriptType: ScriptType;
  },
};
