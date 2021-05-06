import { ProjectType, ScriptType, SmartConfigOption } from './SmartProjectConfig';

export type EnvType = 'development' | 'production';
export type EnvModeType = 'start' | 'test' | 'staging' | 'release';
export type SmartCliType = 'init' | 'create' | 'start' | 'build' | 'page' | 'component' | 'server' | 'upgrade';
export type SmartCreateDirArg = string | Record<string, string> | string[];

export interface SmartCliArgs  {
  host?: string;
  port?: string | number;
  modeType?: EnvModeType;
  pages?: SmartCreateDirArg;
  components?: SmartCreateDirArg;
  scriptType?: ScriptType;
  projectType?: ProjectType;
  projectDir?: string;
  htmlPath?: string;
}

export interface SmartOption {
  cli: SmartCliType;
  args: SmartCliArgs;
}

export interface SmartTaskOption {
  cli: SmartCliType;
  projectOption?: SmartProjectOption;
  serverOption?: SmartServerOptionType;
  pages?: SmartCreatePage;
  components?: SmartCreatePage;
  configOption?: SmartConfigOption;
}

export interface SmartProjectOption {
  scriptType: ScriptType;
  modeType: EnvModeType;
  projectType: ProjectType;
  dirName: string;
  name: string; // use package.json->name
}

export interface SmartServerOptionType {
  port: number;
  host: string;
  htmlPath: string;
}

export interface SmartServerParamsType {
  port: number | string | undefined;
  host: string | undefined;
  htmlPath: string | undefined;
}

export interface SmartCreatePage {
  dirPath: string;
  scriptType: ScriptType;
  names: string[];
}

export interface SmartWebpackOption {
  projectOption: SmartProjectOption;
  configOption: SmartConfigOption;
}


/* task */
