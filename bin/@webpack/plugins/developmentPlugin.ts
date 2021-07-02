import { WebpackPluginInstance, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack';
import ESLintPlugin, { Options } from 'eslint-webpack-plugin';
import { PROJECT_ROOT_PATH } from 'share/path';
import { isDevEnv } from 'share/env';
import { SmartProjectOption } from 'types/Smart';
import FormatWebpackPlugin from './FormatWebpackPlugin';

export function getDevelopmentPlugins({ projectType, scriptType }: SmartProjectOption): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  if (!devMode) {
    return [];
  }

  const options: Options = {
    // context: PROJECT_ROOT_PATH,
    extensions: ['.js','.ts'],
    exclude: [PROJECT_ROOT_PATH + '/node_modules'],
    fix: true,
  };

  return [
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
    // new ESLintPlugin(options),
    new FormatWebpackPlugin({ src: 'hello' }),
];
}
