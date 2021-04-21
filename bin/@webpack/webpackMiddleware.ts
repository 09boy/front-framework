import webpack, { Compiler, Configuration, WebpackPluginInstance } from 'webpack';
import { EnvType } from 'types/EnvType';
import { SmartConfigType } from 'types/SmartConfigType';
import devMiddleware, { Options as ServerMiddlewareOptions, } from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import configuration from '@webpack';


export function getWebpackMiddleware(env: EnvType, config: SmartConfigType): WebpackPluginInstance[] {
  const webpackConfig: Configuration = configuration(env, config);
  const compiler: Compiler = webpack(webpackConfig);
  const publicPath = webpackConfig.output?.publicPath;

  if (typeof publicPath !== 'string') {
    return  [];
  }

  const devOptions: ServerMiddlewareOptions = {
    publicPath: publicPath,
    mimeTypes: { phtml: 'text/html' },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'X-Custom-Header': 'yes',
    },
    writeToDisk: true,
  };

  return [
    devMiddleware(compiler, devOptions),
    hotMiddleware(compiler, {
      path: '/__webpack_hmr',
    }),
  ];
}
