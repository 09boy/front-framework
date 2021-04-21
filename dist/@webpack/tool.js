"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDevEnv = isDevEnv;
exports.parseConfigData = parseConfigData;

var _ProjectType = require("../types/ProjectType");

var _log = require("../share/log");

var _path = require("../share/path");

var _tool = require("../share/tool");

function isDevEnv(env) {
  return env === 'development' || env === 'start';
}

function parseConfigData(env, config) {
  if (process.env.BuildConfig) {
    var _config;

    config = JSON.parse(process.env.BuildConfig);
    env = (_config = config) === null || _config === void 0 ? void 0 : _config.env;
  }

  const devMode = isDevEnv(env);
  let {
    name,
    port,
    host,
    projectType,
    structure,
    entry,
    vendors,
    devtool,
    publicPath,
    buildDir,
    provide,
    resolveAlias,
    scriptingLanguageType,
    base64Limit
  } = config;
  const projectLanguageType = scriptingLanguageType || _ProjectType.ProjectLanguageType.Javascript;
  name = name || 'Smart App';
  projectType = projectType || 'normal';
  port = port || 3000;
  host = host || '127.0.0.1';
  devtool = devMode ? devtool || 'inline-source-map' : 'source-map';
  publicPath = publicPath || '/';
  buildDir = _path.PROJECT_ROOT_PATH + '/' + (buildDir || 'dist');

  if (vendors && typeof vendors === 'object' && Array.isArray(vendors)) {
    throw new Error((0, _log.getLogErrorStr)('"vendors" is not valid object.'));
  }

  if (!structure) {
    throw new Error((0, _log.getLogErrorStr)('"structure" is error.'));
  }

  resolveAlias = { ...resolveAlias
  };
  const copyStructure = { ...structure
  };

  for (const key in copyStructure) {
    if (copyStructure.hasOwnProperty(key)) {
      const value = copyStructure[key];

      if (key !== 'src' && value) {
        resolveAlias[key] = _path.PROJECT_ROOT_PATH + '/' + copyStructure.src + '/' + value;
      }
    }
  }

  const htmlEntryFiles = {};

  for (let key in entry) {
    if (entry.hasOwnProperty(key)) {
      htmlEntryFiles[key] = { ...entry[key],
        favicon: structure.src + '/' + structure.assets + '/' + entry[key].favicon
      };
    }
  }

  const pluginsProps = {
    devMode,
    projectType,
    publicPath,
    provide,
    projectLanguageType,
    entryFiles: htmlEntryFiles
  };
  const loadersProps = {
    env,
    projectType,
    projectLanguageType,
    structure,
    maxSize: base64Limit || 8192
  };
  const entryOutOption = {
    env,
    name,
    port,
    host,
    projectType,
    entryFiles: entry,
    publicPath,
    buildPath: buildDir
  };
  const performance = devMode ? false : {
    hints: 'warning',
    maxEntrypointSize: 400000,
    maxAssetSize: 307200,
    assetFilter: filename => !/\.(mp4|mov|wmv|flv)$/i.test(filename)
  };
  return {
    name,
    structure,
    entryOutOption,
    devtool,
    vendors,
    target: devMode ? 'web' : 'browserslist',
    publicPath,
    devMode,
    pluginsProps,
    loadersProps,
    performance,
    resolveAlias: {
      '@babel/runtime-corejs3': (0, _tool.getDynamicModule)('@babel/runtime-corejs3'),
      'react': _path.PROJECT_ROOT_PATH + '/node_modules/react',
      '@hot-loader/react-dom': _path.PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
      'react-dom': _path.PROJECT_ROOT_PATH + '/node_modules/@hot-loader/react-dom',
      ...resolveAlias
    }
  };
}