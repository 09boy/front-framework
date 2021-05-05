import { WebpackPluginInstance } from 'webpack';
import { getHtmlPlugin } from './htmlPlugin';
import { getStylePlugin } from './stylePlugin';
import { getCommonPlugins } from './commonPlugin';
import { getDevelopmentPlugins } from './developmentPlugin';
import { getProductionPlugins } from './productionPlugin';
import { SmartProjectOption } from 'types/Smart';
import { SmartEntryOption, SmartModeOption } from 'types/SmartProjectConfig';

export type PluginProps = {
  projectOption: SmartProjectOption;
  publicPath: string;
  entryFiles: SmartEntryOption;
  modeOption: SmartModeOption;
  provide?: Record<string, any>;
};

export default function getPlugins({ projectOption, provide, modeOption, entryFiles, publicPath }: PluginProps): WebpackPluginInstance[] {

  return [
    ...getStylePlugin(),
    ...getHtmlPlugin(publicPath, entryFiles),
    ...getCommonPlugins(projectOption.modeType, modeOption, provide),
    ...getDevelopmentPlugins(projectOption),
    ...getProductionPlugins(),
  ];
}
