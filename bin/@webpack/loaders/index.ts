import { ProjectType, ScriptType } from 'types/SmartType';
import { RuleSetRule } from 'webpack';
import { isDevMode } from 'share/smartHelper';
import { getStyleLoader } from './styleLoader';
import { getAssetsLoader } from './assetsLoader';
import { getTranspilingLoader } from './transpilingLoader';

export default function getLoaders(type: ProjectType, sType: ScriptType, base64Limit?: string | number, include?: string[]): RuleSetRule[] {
  // include = include ? include.map(s => PROJECT_ROOT_PATH + '/' + s) : [];

  const isDev = isDevMode();

  return [
    ...getTranspilingLoader(isDev, type, sType),
    ...getStyleLoader(isDev),
    ...getAssetsLoader(isDev, base64Limit),
  ].map(rule => ({
    ...rule,
    exclude: [
      // \\ for Windows, / for macOS and Linux
      /node_modules[\\/]core-js/,
      /node_modules[\\/]webpack[\\/]buildin/,
      /bower_components/
    ],
    include,
    // include: [
    //   /*PROJECT_ROOT_PATH + '/src',
    //   PROJECT_ROOT_PATH + '/index.jsx',
    //   PROJECT_ROOT_PATH + '/index.tsx',
    //   PROJECT_ROOT_PATH + '/index.js',
    //   PROJECT_ROOT_PATH + '/index.ts',
    //   ...(include as string[]),*/
    // ],
  }));
}
