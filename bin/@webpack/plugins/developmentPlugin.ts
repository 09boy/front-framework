import { WebpackPluginInstance, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack';
import ESLintPlugin, { Options } from 'eslint-webpack-plugin';
import { getDynamicModule } from 'share/tool';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';
import { PROJECT_ROOT_PATH } from 'share/path';

export function getDevelopmentPlugins(devMode: boolean, projectType: ProjectType, projectLanguageType: ProjectLanguageType): WebpackPluginInstance[] {
  if (!devMode) {
    return [];
  }

  const isTs = projectLanguageType !== 'js';
  const options: Options = {
    extensions: ['js', 'ts', 'jsx', 'tsx', 'json'],
    fix: true,
  };

  if (projectType === 'react') {
    const presets = !isTs ? [[getDynamicModule('@babel/preset-react'), { development: true }], getDynamicModule('@babel/preset-flow')] :
      [
        [getDynamicModule('@babel/preset-react'), { development: true }],
        [getDynamicModule('@babel/preset-typescript'), { isTsx: true, allExtensions: true }],
        getDynamicModule('@babel/preset-flow')
      ];

    options.baseConfig = {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 2020,
        project: PROJECT_ROOT_PATH + '/tsconfig.json',
        /*babelOptions: {
          env: {
            development: {
              presets,
            }
          }
        },*/
      },
    };
  }

  return [
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
    new ESLintPlugin(options),
];
}
