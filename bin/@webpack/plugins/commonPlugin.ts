import { WebpackPluginInstance, DefinePlugin, ProvidePlugin } from 'webpack';
import { SmartModeOption } from 'types/SmartProjectConfig';
import { isDevEnv } from 'share/env';
import { EnvModeType } from 'types/Smart';

export  function getCommonPlugins(modeType: EnvModeType, mode: SmartModeOption, provide?: Record<string, any>): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  const items = [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production'),
    }),
  ];

  for (const key in mode) {
    if (Object.hasOwnProperty.call(mode, key)) {
      const option = mode[key];
      if (typeof option === 'object' && Object.hasOwnProperty.call(option, modeType)) {
        const value: string = option[modeType];
        items.push(new DefinePlugin({
          [key]: JSON.stringify(value),
        }));
      }
    }
  }

  if (provide) {
    items.push(new ProvidePlugin(provide));
  }
  return items;
}
