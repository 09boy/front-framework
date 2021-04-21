import { EnvType } from 'types/EnvType';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';

export type EntryType = {
  [key: string]: {
    path: string;
    favicon: string | undefined;
    title?: string;
  }
};

export type ProjectStructureType = {
  src: string;
  pages: string;
  assets: string;
  app?: string;
  components?: string;
};

export type SmartConfigType = {
  host?: string;
  port?: number;
  entry: EntryType;
  buildDir: string;
  publicPath: string;
  devtool?: string;
  base64Limit?: number;
  loaderIncludes?: string[];
  vendors?: string[];
  structure: ProjectStructureType,
  provide?: {
    [key: string]: string;
  };
  resolveAlias?: Record<string, any>,
  globals?: {
    [key: string]: {
      [env in EnvType]?: string;
    };
  },
  scriptingLanguageType?: ProjectLanguageType;
  projectType?: ProjectType;
  name?: string;
  env?: string;
};

export type CreateOptionType = {
  projectName: string;
  projectType: ProjectType;
  structure: ProjectStructureType;
  projectLanguageType: ProjectLanguageType;
};
