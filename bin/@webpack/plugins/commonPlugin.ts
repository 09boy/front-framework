import { WebpackPluginInstance, DefinePlugin, ProvidePlugin } from 'webpack';
import { isDevEnv } from 'share/env';

export  function getCommonPlugins(provide?: Record<string, any>): WebpackPluginInstance[] {
  const devMode = isDevEnv();
  const items = [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production'),
    }),
  ];

  if (provide) {
    items.push(new ProvidePlugin(provide));
  }
  return items;
}
