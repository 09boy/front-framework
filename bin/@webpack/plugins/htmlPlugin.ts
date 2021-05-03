import { WebpackPluginInstance } from 'webpack';
import HtmlWebpackPlugin, { Options } from 'html-webpack-plugin';
import { SmartEntryOption } from 'types/SmartProjectConfig';
import { isDevEnv } from 'share/env';


export function getHtmlPlugin(publicPath: string, entryFiles: SmartEntryOption): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  const instances: WebpackPluginInstance[] = [];

  for (const key in entryFiles) {
    if (Object.hasOwnProperty.call(entryFiles, key)) {
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
