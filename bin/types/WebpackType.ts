import { ProjectType } from './SmartType';

export type EntryAndOutputOptions = {
  isDevMode: boolean;
  projectType: ProjectType;
  host: string;
  port: number;
  name: string;
  entryPath: string;
  publicPath: string;
  buildPath: string;
};

export type PluginOptions = {
  publicPath: string;
  entryPath: string;
  title?: string;
  favicon?: string;
  eslintEnabled?: boolean | null | undefined;
  globalVar?: Record<string, any>;
  provide?: Record<string, string>;
};