"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSmartConfigureData = getSmartConfigureData;
exports.parseSmartOption = parseSmartOption;

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _path = require("path");

var _fs = require("fs");

var _log = require("./log");

var _path2 = require("./path");

var _LogType = require("../types/LogType");

var _projectHelper = require("./projectHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function getSmartConfigureData(isSTProject, option) {
  const {
    cli,
    args: {
      projectType,
      port,
      host,
      htmlPath
    }
  } = option;

  if (cli === 'upgrade') {
    return {
      cli
    };
  }

  if (!isSTProject && cli === 'server') {
    return getServerTaskOption({
      port,
      host,
      htmlPath
    });
  }

  try {
    const packageData = cli !== 'server' && isSTProject ? await Promise.resolve(`${_path2.PROJECT_ROOT_PATH}/package.json`).then(s => _interopRequireWildcard(require(s))) : undefined;
    const path = isSTProject ? `${_path2.PROJECT_ROOT_PATH}/smart.config.yml` : (0, _path.join)(__dirname, '..', `smart/templates/smart-config/${projectType || 'normal'}.smart.config.yml`);

    const smartConfigData = _jsYaml.default.load((0, _fs.readFileSync)(path, 'utf8'));

    if (cli === 'server') {
      return getServerTaskOption({
        port,
        host,
        htmlPath: htmlPath || smartConfigData.buildDir
      });
    }

    return parseSmartOption(option, smartConfigData, packageData);
  } catch (e) {
    (0, _log.PrintLog)(_LogType.LogType.configFileLoadFailed, e.message);
  }

  return {
    cli
  };
}

function parseSmartOption(option, defaultData, packageData) {
  const {
    cli,
    args: {
      port,
      host,
      projectType,
      components,
      pages,
      projectDir,
      modeType,
      scriptType,
      htmlPath
    }
  } = option;
  const {
    structure,
    buildDir
  } = defaultData; // if structure value is null to use key

  const copyStructure = { ...structure
  };

  for (const key in copyStructure) {
    if (Object.hasOwnProperty.call(copyStructure, key)) {
      const value = copyStructure[key];

      if (!value) {
        Object.assign(structure, {
          [key]: key
        });
      }
    }
  }

  const {
    componentsPath,
    pagesPath
  } = (0, _projectHelper.getProjectStructurePath)(structure);
  const st = scriptType || (packageData === null || packageData === void 0 ? void 0 : packageData.smart.scriptType) || 'js';
  const projectOption = {
    scriptType: st,
    projectType: projectType || (packageData === null || packageData === void 0 ? void 0 : packageData.smart.projectType) || 'normal',
    modeType: modeType || 'start',
    dirName: projectDir || _path2.PROJECT_ROOT_PATH.split('/').pop(),
    name: (packageData === null || packageData === void 0 ? void 0 : packageData.name) || 'Smart App'
  };
  const serverOption = getServerOption({
    port: port || defaultData.port,
    host: host || defaultData.host,
    htmlPath: htmlPath || buildDir
  });
  let smartPages;
  let smartComponents;

  if (pages) {
    smartPages = {
      dirPath: pagesPath,
      scriptType: st,
      names: (0, _projectHelper.getCreateNames)(pages)
    };
  }

  if (components && projectDir) {
    smartComponents = {
      dirPath: componentsPath,
      scriptType: st,
      names: (0, _projectHelper.getCreateNames)(components)
    };
  }

  return {
    cli,
    projectOption,
    serverOption,
    pages: smartPages,
    components: smartComponents,
    configOption: { ...defaultData,
      port: serverOption.port,
      host: serverOption.host
    }
  };
}

function getHtmlPath(htmlPath) {
  if (!htmlPath) {
    return _path2.PROJECT_ROOT_PATH + '/index.html';
  }

  htmlPath = htmlPath.startsWith('/') ? htmlPath.substr(1, htmlPath.length) : htmlPath;
  htmlPath = htmlPath.endsWith('.html') ? htmlPath : htmlPath.endsWith('/') ? htmlPath + 'index.html' : htmlPath + '/index.html';
  return _path2.PROJECT_ROOT_PATH + '/' + htmlPath;
}

function getServerOption({
  port,
  host,
  htmlPath
}) {
  return {
    port: Number(port) || 3000,
    host: host || '127.0.0.1',
    htmlPath: getHtmlPath(htmlPath)
  };
}

function getServerTaskOption(serverParam) {
  return {
    cli: 'server',
    serverOption: getServerOption(serverParam)
  };
}