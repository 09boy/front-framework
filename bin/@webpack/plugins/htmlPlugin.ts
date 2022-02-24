import { WebpackPluginInstance } from 'webpack';
import HtmlWebpackPlugin, { Options } from 'html-webpack-plugin';

export function getHtmlPlugin(publicPath: string, entryFile: string, isDevMode: boolean, title?: string, favicon?: string): WebpackPluginInstance {
  const option: Options = {
    hash: isDevMode,
    inject: 'body',
    title: title || 'Smart Project',
    template: 'index.template.html',
    favicon,
    publicPath,
  };
  return new HtmlWebpackPlugin(option);
}
