import { WebpackPluginInstance } from 'webpack';
import HtmlWebpackPlugin, { Options } from 'html-webpack-plugin';
import { EntryType } from 'types/SmartConfigType';


export function getHtmlPlugin(devMode: boolean, publicPath: string, entryFiles: EntryType): WebpackPluginInstance[] {
  const instances: WebpackPluginInstance[] = [];

  for (let key in entryFiles) {
    if (entryFiles.hasOwnProperty(key)) {
      const pages = entryFiles[key];
      const options: Options = {
        hash: devMode,
        inject: 'body',
        title: pages.title || key,
        template: 'index.template.html',
        favicon: pages.favicon,
        publicPath,
      };
      instances.push(new HtmlWebpackPlugin(options));
    }
  }
  return instances;
}
