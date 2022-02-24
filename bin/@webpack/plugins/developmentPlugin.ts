import { WebpackPluginInstance, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin } from 'webpack';
import ESLintPlugin, { Options } from 'eslint-webpack-plugin';
import { PROJECT_ROOT_PATH } from 'share/path';
// import FormatWebpackPlugin from './FormatWebpackPlugin';

export function getDevelopmentPlugins(isDevMode: boolean, eslintEnabled?: boolean | null): WebpackPluginInstance[] {
  const plugins: WebpackPluginInstance[] = [];

  if (!isDevMode) {
    return plugins;
  }

  plugins.push(
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
  );

  if (eslintEnabled) {
    const options: Options = {
      context: PROJECT_ROOT_PATH,
      // eslintPath: PROJECT_ROOT_PATH + '/eslintrc.js',
      extensions: ['.js','.ts', '.jsx', '.tsx', 'json'],
      exclude: ['/node_modules', `/bower_components/`,],
      fix: true,
    };
    plugins.push(new ESLintPlugin(options));
  }

  return plugins;
}
