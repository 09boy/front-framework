import { WebpackPluginInstance } from 'webpack';
import { PluginOptions } from 'types/WebpackType';
import { isDevMode } from 'share/smartHelper';
import { getHtmlPlugin } from './htmlPlugin';
import { getStylePlugin } from './stylePlugin';
import { getCommonPlugins } from './commonPlugin';
import { getDevelopmentPlugins } from './developmentPlugin';
import { getProductionPlugins } from './productionPlugin';

export default function getPlugins({ entryPath, publicPath, favicon, title, globalVar, provide, eslintEnabled }: PluginOptions): WebpackPluginInstance[] {
  const isDev = isDevMode();
  return [
    getHtmlPlugin(publicPath, entryPath, isDev, title, favicon),
    ...getStylePlugin(isDev),
    ...getCommonPlugins(isDev, globalVar, provide),
    ...getDevelopmentPlugins(isDev, eslintEnabled),
    ...getProductionPlugins(isDev),
  ];
}
