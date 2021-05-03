import { WebpackPluginInstance } from 'webpack';
import { getHtmlPlugin } from './htmlPlugin';
import { getStylePlugin } from './stylePlugin';
import { getCommonPlugins } from './commonPlugin';
import { getDevelopmentPlugins } from './developmentPlugin';
import { getProductionPlugins } from './productionPlugin';
import { SmartProjectOption } from 'types/Smart';
import { SmartEntryOption } from 'types/SmartProjectConfig';

export type PluginProps = {
  projectOption: SmartProjectOption;
  publicPath: string;
  entryFiles: SmartEntryOption;
  provide?: Record<string, any>;
};

export default function getPlugins({ projectOption, provide, entryFiles, publicPath }: PluginProps): WebpackPluginInstance[] {

  return [
    ...getStylePlugin(),
    ...getHtmlPlugin(publicPath, entryFiles),
    ...getCommonPlugins(provide),
    ...getDevelopmentPlugins(projectOption),
    ...getProductionPlugins(),
  ];
}
