import { RuleSetRule } from 'webpack';
import { EnvType } from 'types/EnvType';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';
import { getStyleLoader } from './styleLoader';
import { getFileLoader } from './fileLoader';
import { getTemplatingLoader } from './templatingLoader';
import { getTranspilingLoader } from './transpilingLoader';
import { ProjectStructureType } from 'types/SmartConfigType';
import { PROJECT_ROOT_PATH } from 'share/path';


type Props = {
  env: EnvType;
  projectType: ProjectType;
  projectLanguageType: ProjectLanguageType;
  structure: ProjectStructureType;
  maxSize: number
};

export default function getLoaders({env, projectType, projectLanguageType, structure, maxSize}: Props, include: string[] = []): RuleSetRule[] {
  const { assets, src } = structure;
  const staticPath = assets + '/';

  include = include.map(s => PROJECT_ROOT_PATH + '/' + s);

  return [
    ...getTranspilingLoader(env, projectType, projectLanguageType),
    ...getTemplatingLoader(),
    ...getStyleLoader(env),
    ...getFileLoader(env, staticPath, maxSize),
  ].map(rule => ({
    ...rule,
    exclude: [
      // \\ for Windows, / for macOS and Linux
      /node_modules[\\/]core-js/,
      /node_modules[\\/]webpack[\\/]buildin/,
      /bower_components/
    ],
    include: [
      PROJECT_ROOT_PATH + '/' + src,
      PROJECT_ROOT_PATH + '/index.js',
      PROJECT_ROOT_PATH + '/index.ts',
      ...include,
    ],
  }));
}
