import { WebpackPluginInstance } from 'webpack';
import { getHtmlPlugin } from './htmlPlugin';
import { getStylePlugin } from './stylePlugin';
import { getCommonPlugins } from './commonPlugin';
import { getDevelopmentPlugins } from './developmentPlugin';
import { getProductionPlugins } from './productionPlugin';
import { ProjectLanguageType, ProjectType } from 'types/ProjectType';
import { EntryType } from 'types/SmartConfigType';

type Props = {
  devMode: boolean;
  publicPath: string;
  projectType: ProjectType;
  entryFiles: EntryType;
  projectLanguageType: ProjectLanguageType;
  provide?: Record<string, any>;
};

export default function getPlugins({ devMode, entryFiles,publicPath, provide, projectType, projectLanguageType}: Props): WebpackPluginInstance[] {

  return [
    ...getStylePlugin(devMode),
    ...getHtmlPlugin(devMode, publicPath, entryFiles),
    ...getCommonPlugins(devMode, provide),
    ...getDevelopmentPlugins(devMode, projectType, projectLanguageType),
    ...getProductionPlugins(devMode),
  ];
}
