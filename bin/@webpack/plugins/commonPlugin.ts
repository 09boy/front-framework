import { getGlobalEnvVar } from 'share/webpackHelper';
import { DefinePlugin, ProvidePlugin, SourceMapDevToolPlugin, WebpackPluginInstance } from 'webpack';

export  function getCommonPlugins(isDevMode: boolean, mode?: Record<string, any>, provide?: Record<string, string>): WebpackPluginInstance[] {
  const items = [];

  items.push(new SourceMapDevToolPlugin({
    // filename[error]: https://github.com/webpack/webpack/issues/9732
    filename: isDevMode ? '[file].js.map[query]' : 'sourcemaps/[name].[contenthash].map',
    exclude: ['node_modules'],
  }),)

  const defineVars: Record<string, any> = {
    'process.env.NODE_ENV': isDevMode ? 'development' : 'production',
    'process.env.DEBUG': isDevMode,
    //   __VUE_OPTIONS_API__: false,
    //   __VUE_PROD_DEVTOOLS__: false,
    ...getGlobalEnvVar(mode),
  };

  const defineOption: Record<string, string | boolean> = {};

  for (const key in defineVars) {
    if (Object.hasOwnProperty.call(defineVars, key)) {
      const value: unknown = defineVars[key];
      defineOption[key] = typeof value === 'boolean' ? value : JSON.stringify(value) ;
    }
  }

  items.push(new DefinePlugin(defineOption));


  if (provide) {
    const provideData: Record<string, string> = {};
    for (const key in provide) {
      if (Object.hasOwnProperty.call(provide, key)) {
        provideData[key] = provide[key];
      }
    }
    items.push(new ProvidePlugin(provideData));
  }
  return items;
}
