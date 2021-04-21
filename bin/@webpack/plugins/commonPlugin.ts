import { WebpackPluginInstance, DefinePlugin, ProvidePlugin } from 'webpack';

export  function getCommonPlugins(devMode: boolean, provide?: Record<string, any>): WebpackPluginInstance[] {
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
