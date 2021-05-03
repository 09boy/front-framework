import webpack, { Compiler, Configuration, WebpackPluginInstance } from 'webpack';
import { SmartWebpackOption } from 'types/Smart';
import { SmartConfigOption } from 'types/SmartProjectConfig';
import devMiddleware, { Options as ServerMiddlewareOptions } from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import configuration from '@webpack';


export function getWebpackMiddleware(option: SmartWebpackOption): WebpackPluginInstance[] {
  const webpackConfig: Configuration = configuration(option);
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
    devMiddleware(compiler as any, devOptions),
    hotMiddleware(compiler as any, {
      path: '/__webpack_hmr',
    }),
  ];
}
