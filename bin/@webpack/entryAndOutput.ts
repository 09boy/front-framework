import webpack, { Entry } from 'webpack';
import { EnvType } from 'types/EnvType';
import { ProjectType } from 'types/ProjectType';
import { EntryType } from 'types/SmartConfigType';
import { getDynamicModule } from 'share/tool';
import { isDevEnv } from './tool';
import { PROJECT_ROOT_PATH } from 'share/path';


export type EntryAndOutputOptionsType = {
  env: EnvType;
  projectType: ProjectType;
  host: string;
  port: number;
  entryFiles: EntryType;
  name: string;
  publicPath: string;
  buildPath: string;
};

function getDevelopmentHRMItem(devMode: boolean, entryPath: string, projectType: ProjectType, host: string, port: number | string, name: string): string | string[] {

   if (devMode) {
     const item: string[] = [
       `${getDynamicModule('webpack-hot-middleware')}/client?path=http://${host}:${port}/__webpack_hmr&name=${name}&reload=true&overlay=true&timeout=3000`,
       entryPath,
     ];

     if (projectType === 'react') {
       item.splice(1,0, getDynamicModule('react-hot-loader/patch'));
     }

     return item;
   }

   return entryPath;
}

export function getWebpackEntryAndOutputConfiguration({ env, entryFiles, projectType, host, port, name, publicPath, buildPath }: EntryAndOutputOptionsType): {
  entry: Entry,
  output: any,
} {
  const devMode = isDevEnv(env);
  const entry: Entry = {};


  for (const key in entryFiles) {
    if (entryFiles.hasOwnProperty(key)) {
      let { path } = entryFiles[key];
      path = PROJECT_ROOT_PATH + '/' + path;
      entry[key] = {
        import: getDevelopmentHRMItem(devMode, path, projectType, host, port, name),
        dependOn: entry.shared ? 'shared' : undefined,
      };
    }
  }

  return {
    entry,
    output: getOutputConfiguration(devMode, publicPath, buildPath),
  };
}

function getOutputConfiguration(devMode: boolean, publicPath: string, path: string): webpack.AssetInfo {
  const filename = devMode ? '[name].js' : 'js/[name].[contenthash].min.js';
  const chunkFilename = devMode ? '[name].js' : 'js/[name].[chunkhash].min.js';

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
    assetModuleFilename: 'assets/[hash][ext][query]',
    pathinfo: devMode,

    //issues: [chunkLoading, wasmLoading]  https://github.com/webpack/webpack/issues/11660
   /* chunkLoading: false,
    wasmLoading: false,*/

   /* enabledChunkLoadingTypes: ['jsonp', 'require'],
    crossOriginLoading: 'use-credentials',
    chunkFormat: 'commonjs',
    libraryTarget: 'umd',*/
    clean: !devMode,
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: true,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: true,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: true,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: true,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: true,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: true,
    }
  };
}
