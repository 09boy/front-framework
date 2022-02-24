// import webpack, { Compiler, Configuration, WebpackPluginInstance } from 'webpack';
// import { SmartWebpackOption } from 'types/SmartType';
// import devMiddleware, { Options as ServerMiddlewareOptions } from 'webpack-dev-middleware';
// import historyApiFallback from 'connect-history-api-fallback';
// import hotMiddleware from 'webpack-hot-middleware';
// import configuration from '@webpack';
//
// export function getWebpackMiddleware(option: SmartWebpackOption): WebpackPluginInstance[] {
//   const webpackConfig: Configuration = configuration(option);
//   const compiler: Compiler = webpack(webpackConfig);
//   const publicPath = webpackConfig.output?.publicPath;
//
//   if (typeof publicPath !== 'string') {
//     return  [];
//   }
//
//   const devOptions: ServerMiddlewareOptions = {
//     publicPath,
//     mimeTypes: { phtml: 'text/html' },
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Headers': 'X-Requested-With',
//       'X-Custom-Header': 'yes',
//     },
//     writeToDisk: filename => filename.includes('index.html'),
//   };
//   const devCompiler = devMiddleware(compiler as any, devOptions);
//   // console.log(devCompiler);
//   return [
//     historyApiFallback(),
//     devCompiler,
//     hotMiddleware(compiler as any, {
//       path: '/__webpack_hmr',
//     }),
//     historyApiFallback(),
//   ];
// }
"use strict";