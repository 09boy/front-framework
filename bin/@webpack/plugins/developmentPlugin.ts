import { WebpackPluginInstance, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack';
import ESLintPlugin, { Options } from 'eslint-webpack-plugin';
/*import { getDynamicModule } from 'share/projectHelper';
import { PROJECT_ROOT_PATH } from 'share/path';*/
import { isDevEnv } from 'share/env';
import { SmartProjectOption } from 'types/Smart';

export function getDevelopmentPlugins({ projectType }: SmartProjectOption): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  if (!devMode) {
    return [];
  }

  // const isTs = scriptType === 'ts';
  const options: Options = {
    extensions: ['js', 'ts', 'jsx', 'tsx', 'json'],
    fix: true,
  };

  if (projectType === 'react') {
    /*const presets = !isTs ? [[getDynamicModule('@babel/preset-react'), { development: true }], getDynamicModule('@babel/preset-flow')] :
      [
        [getDynamicModule('@babel/preset-react'), { development: true }],
        [getDynamicModule('@babel/preset-typescript'), { isTsx: true, allExtensions: true }],
        getDynamicModule('@babel/preset-flow')
      ];*/

    /*options.baseConfig = {
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
        ecmaVersion: 2020,
        project: PROJECT_ROOT_PATH + '/tsconfig.json',
        /!*babelOptions: {
          env: {
            development: {
              presets,
            }
          }
        },*!/
      },
    };*/
  }

  return [
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
    new ESLintPlugin(options),
];
}
