import webpack, { Entry } from 'webpack';
import { ProjectType } from 'types/SmartType';
import { EntryAndOutputOptions } from 'types/WebpackType';
import { getDynamicModule } from 'share/smartHelper';

function getEntryItem(isDevMode: boolean, type: ProjectType, host: string, port: number, name: string, entryPath: string): Entry {
  if (isDevMode) {
    // path=http://${host}:${port}/__webpack_hmr&name=${name}&
    const main: string[] =  [
      // 'core-js/stable',
      getDynamicModule('regenerator-runtime/runtime'),
      `${getDynamicModule('webpack-hot-middleware')}/client?reload=true&overlay=true&timeout=2000`,
    ];
    const entry: Entry = {
       main,
     };
     if (type === 'react') {
       // main.push(getDynamicModule('react-hot-loader/patch'));
     }
     main.push(entryPath);
     return entry;
   }

   return [getDynamicModule('regenerator-runtime/runtime'), entryPath];
}

export function getWebpackEntryAndOutputConfiguration({ isDevMode, projectType, host, port, name, publicPath, buildPath, entryPath }: EntryAndOutputOptions): {
  entry: Entry,
  output: Record<string, any>,
} {

  const entry: Entry = getEntryItem(isDevMode, projectType, host, port, name, entryPath);

  return {
    entry: entry,
    output: getOutputConfiguration(isDevMode, publicPath, buildPath),
  };
}

function getOutputConfiguration(isDevMode: boolean, publicPath: string, path: string): webpack.AssetInfo {
  const filename = isDevMode ? '[name].js' : 'scripts/[name].[contenthash].min.js';
  const chunkFilename = isDevMode ? '[name].js' : 'scripts/chunks/[name].[chunkhash].min.js';
  // const assetModuleFilename = isDevMode ? 'assets/[name][ext][query]' : 'assets/[hash][ext][query]';

  return {
    filename,
    chunkFilename,
    path,
    /*
     *  publicPath: 'https://cdn.example.com/assets/', // CDN (always HTTPS)
     *  publicPath: '//cdn.example.com/assets/', // CDN (same protocol)
     *  publicPath: '/assets/', // server-relative
     * */
    publicPath,
    // assetModuleFilename,
    pathinfo: isDevMode,

    //issues: [chunkLoading, wasmLoading]  https://github.com/webpack/webpack/issues/11660
   /* chunkLoading: false,
    wasmLoading: false,*/

   /* enabledChunkLoadingTypes: ['jsonp', 'require'],
    crossOriginLoading: 'use-credentials',
    chunkFormat: 'commonjs',
    libraryTarget: 'umd',*/
    clean: !isDevMode,
    // environment: {
    //   // The environment supports arrow functions ('() => { ... }').
    //   arrowFunction: true,
    //   // The environment supports BigInt as literalf (123n).
    //   bigIntLiteral: false,
    //   // The environment supports const and let for variable declarations.
    //   const: true,
    //   // The environment supports destructuring ('{ a, b } = obj').
    //   destructuring: true,
    //   // The environment supports an async import() function to import EcmaScript modules.
    //   dynamicImport: true,
    //   // The environment supports 'for of' iteration ('for (const x of array) { ... }').
    //   forOf: true,
    //   // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
    //   module: true,
    // }
  };
}
