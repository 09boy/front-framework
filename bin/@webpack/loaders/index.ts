import { RuleSetRule } from 'webpack';
import { SmartStructureOption } from 'types/SmartProjectConfig';
import { getStyleLoader } from './styleLoader';
import { getFileLoader } from './fileLoader';
import { getTranspilingLoader } from './transpilingLoader';
import { PROJECT_ROOT_PATH } from 'share/path';
import { SmartProjectOption } from 'types/Smart';


export type LoaderProps = {
  projectOption: SmartProjectOption;
  structure: SmartStructureOption;
  maxSize: number
};

export default function getLoaders({ projectOption, structure, maxSize }: LoaderProps, include?: string[]): RuleSetRule[] {
  include = include ? include.map(s => PROJECT_ROOT_PATH + '/' + s) : [];

  return [
    ...getTranspilingLoader(projectOption),
    ...getStyleLoader(projectOption.projectType),
    ...getFileLoader(structure, maxSize),
  ].map(rule => ({
    ...rule,
    exclude: [
      // \\ for Windows, / for macOS and Linux
      /node_modules[\\/]core-js/,
      /node_modules[\\/]webpack[\\/]buildin/,
      /bower_components/
    ],
    include: [
      PROJECT_ROOT_PATH + '/' + structure.src,
      PROJECT_ROOT_PATH + '/index.tsx',
      PROJECT_ROOT_PATH + '/index.tsx',
      ...(include as string[]),
    ],
  }));
}
