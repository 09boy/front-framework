"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWebpackEntryAndOutputConfiguration = getWebpackEntryAndOutputConfiguration;

var _tool = require("../share/tool");

var _tool2 = require("./tool");

var _path = require("../share/path");

function getDevelopmentHRMItem(devMode, entryPath, projectType, host, port, name) {
  if (devMode) {
    const item = [`${(0, _tool.getDynamicModule)('webpack-hot-middleware')}/client?path=http://${host}:${port}/__webpack_hmr&name=${name}&reload=true&overlay=true&timeout=3000`, entryPath];

    if (projectType === 'react') {
      item.splice(1, 0, (0, _tool.getDynamicModule)('react-hot-loader/patch'));
    }

    return item;
  }

  return entryPath;
}

function getWebpackEntryAndOutputConfiguration({
  env,
  entryFiles,
  projectType,
  host,
  port,
  name,
  publicPath,
  buildPath
}) {
  const devMode = (0, _tool2.isDevEnv)(env);
  const entry = {};

  for (const key in entryFiles) {
    if (entryFiles.hasOwnProperty(key)) {
      let {
        path
      } = entryFiles[key];
      path = _path.PROJECT_ROOT_PATH + '/' + path;
      entry[key] = {
        import: getDevelopmentHRMItem(devMode, path, projectType, host, port, name),
        dependOn: entry.shared ? 'shared' : undefined
      };
    }
  }

  return {
    entry,
    output: getOutputConfiguration(devMode, publicPath, buildPath)
  };
}

function getOutputConfiguration(devMode, publicPath, path) {
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
      module: true
    }
  };
}