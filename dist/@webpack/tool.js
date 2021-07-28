"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseConfigData = parseConfigData;

var _log = require("../share/log");

var _path = require("../share/path");

var _env = require("../share/env");

var _webpackHelper = require("../share/webpackHelper");

function parseConfigData({
  projectOption,
  configOption
}) {
  const devMode = (0, _env.isDevEnv)();
  const {
    projectType,
    name,
    scriptType,
    modeType
  } = projectOption;
  const {
    port,
    host,
    base64Limit,
    entry,
    devtool,
    vendors,
    provide,
    structure,
    mode
  } = configOption;
  const publicPath = configOption.publicPath || '/';
  const buildDir = _path.PROJECT_ROOT_PATH + '/' + (configOption.buildDir || 'dist');

  if (vendors && !(Object.prototype.toString.call(vendors) === '[object Object]' || Array.isArray(vendors))) {
    throw new Error((0, _log.getLogErrorStr)('"vendors" is not valid object.'));
  }

  if (!structure) {
    throw new Error((0, _log.getLogErrorStr)('"structure" is error.'));
  }

  const htmlEntryFiles = {};
  const imagePath = typeof structure.assets === 'string' ? structure.assets : 'assets';

  for (const key in entry) {
    if (Object.hasOwnProperty.call(entry, key)) {
      var _entry$key;

      htmlEntryFiles[key] = { ...entry[key],
        favicon: (_entry$key = entry[key]) !== null && _entry$key !== void 0 && _entry$key.favicon ? `${structure.src}/${imagePath}/${entry[key].favicon}` : undefined
      };
    }
  }

  console.log('htmlEntryFiles::', htmlEntryFiles);
  const pluginsProps = {
    projectOption,
    publicPath,
    provide,
    modeOption: mode,
    entryFiles: htmlEntryFiles
  };
  const loadersProps = {
    projectOption,
    structure,
    maxSize: base64Limit || 8192
  };
  const entryOutOption = {
    devMode,
    name,
    port,
    host,
    projectType,
    entryFiles: entry,
    publicPath,
    buildPath: buildDir
  };
  const performance = devMode ? undefined : {
    hints: 'warning',
    maxEntrypointSize: 400000,
    maxAssetSize: 307200,
    assetFilter: filename => !/\.(mp4|mov|wmv|flv)$/i.test(filename)
  };
  return {
    devMode,
    name,
    entryOutOption,
    devtool: devMode ? devtool || 'inline-source-map' : 'source-map',
    target: devMode ? 'web' : 'browserslist',
    publicPath,
    pluginsProps,
    loadersProps,
    performance,
    resolveAlias: (0, _webpackHelper.getResolveAlias)(projectType, structure.src),
    resolveExtensions: (0, _webpackHelper.getResolveExtensions)(projectType, scriptType),
    optimization: {
      devMode,
      modeType,
      vendors
    }
  };
}