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

async function getSmartConfigureData(isNewProject, {
  cli,
  args
}) {
  if (cli === 'upgrade') {
    return {
      cli
    };
  } // if only start server


  if (isNewProject && cli === 'server') {
    return getServerTaskOption(args);
  }

  if (isNewProject && args !== null && args !== void 0 && args.projectDir) {
    if (!(0, _projectHelper.isValidProjectName)(args.projectDir)) {
      (0, _log.PrintLog)(_LogType.LogType.projectExist, args.projectDir);
      process.exit(0);
    }
  }

  try {
    let packageData = undefined;
    let smartConfigPath = (0, _path.join)(__dirname, '..', `smart/templates/smart-config/${(args === null || args === void 0 ? void 0 : args.projectType) || 'normal'}.smart.config.yml`);

    if (!isNewProject) {
      smartConfigPath = `${_path2.PROJECT_ROOT_PATH}/smart.config.yml`;
      packageData = await Promise.resolve(`${_path2.PROJECT_ROOT_PATH}/package.json`).then(s => _interopRequireWildcard(require(s)));
    }

    const smartConfigData = _jsYaml.default.load((0, _fs.readFileSync)(smartConfigPath, 'utf8'));

    return parseSmartOption({
      cli,
      args
    }, smartConfigData, packageData);
  } catch (e) {
    (0, _log.PrintLog)(_LogType.LogType.configFileLoadFailed, e.message);
  }

  return {
    cli
  };
}
/*
* @packageData if value is undefined, it is a new project will to create;
* */


function parseSmartOption({
  cli,
  args
}, defaultData, packageData) {
  if (cli === 'server') {
    return getServerTaskOption({ ...args,
      htmlPath: (args === null || args === void 0 ? void 0 : args.htmlPath) || defaultData.buildDir
    });
  }

  const projectOption = {
    scriptType: (args === null || args === void 0 ? void 0 : args.scriptType) || 'js',
    projectType: (args === null || args === void 0 ? void 0 : args.projectType) || 'normal',
    modeType: (args === null || args === void 0 ? void 0 : args.modeType) || 'start',
    dirName: (args === null || args === void 0 ? void 0 : args.projectDir) || _path2.PROJECT_ROOT_PATH.split('/').pop(),
    name: (packageData === null || packageData === void 0 ? void 0 : packageData.name) || (args === null || args === void 0 ? void 0 : args.projectDir) || 'Smart Project'
  };
  const configOption = { ...defaultData,
    structure: getStructure(projectOption.projectType),
    host: (args === null || args === void 0 ? void 0 : args.host) || defaultData.host,
    port: (args === null || args === void 0 ? void 0 : args.port) || defaultData.port
  };

  if (packageData) {
    let smartPages;
    let smartComponents;

    if (cli === 'page' || cli === 'component') {
      const {
        pages,
        components,
        src
      } = configOption.structure;

      if (args !== null && args !== void 0 && args.pages) {
        smartPages = {
          dirPath: `${src}/${pages}`,
          scriptType: packageData.smart.scriptType,
          names: (0, _projectHelper.getCreateNames)(args.pages)
        };
      }

      if (args !== null && args !== void 0 && args.components && components) {
        smartComponents = {
          dirPath: `${src}/${components}`,
          scriptType: packageData.smart.scriptType,
          names: (0, _projectHelper.getCreateNames)(args.components)
        };
      }
    }

    return {
      cli,
      projectOption: { ...projectOption,
        scriptType: packageData.smart.scriptType,
        projectType: packageData.smart.projectType
      },
      configOption,
      serverOption: getServerTaskOption({
        host: (args === null || args === void 0 ? void 0 : args.host) || defaultData.host,
        port: (args === null || args === void 0 ? void 0 : args.port) || defaultData.port,
        htmlPath: (args === null || args === void 0 ? void 0 : args.htmlPath) || defaultData.buildDir
      }).serverOption,
      pages: smartPages,
      components: smartComponents
    };
  } // new project


  if (!args) {
    (0, _log.PrintLog)(_LogType.LogType.cliArgTypeError);
    process.exit(0);
  }

  return {
    cli,
    projectOption,
    configOption
  };
}

function getStructure(projectType) {
  switch (projectType) {
    case "react":
    case "vue":
      return {
        src: 'src',
        pages: 'pages',
        assets: {
          images: 'images',
          styles: 'styles'
        },
        components: 'components',
        app: 'app'
      };

    case "nodejs":
      return {
        src: 'src',
        pages: 'routers',
        assets: 'assets'
      };

    case "miniProgram":
      return {
        src: 'src',
        pages: 'pages',
        assets: 'assets'
      };

    case "normal":
    default:
      return {
        src: 'src',
        pages: 'pages',
        assets: {
          images: 'images',
          styles: 'styles'
        }
      };
  }
}

function getHtmlPath(htmlPath) {
  if (!htmlPath) {
    return _path2.PROJECT_ROOT_PATH + '/dist/index.html';
  }

  htmlPath = htmlPath.startsWith('/') ? htmlPath.substr(1, htmlPath.length) : htmlPath;
  htmlPath = htmlPath.endsWith('.html') ? htmlPath : htmlPath.endsWith('/') ? htmlPath + 'index.html' : htmlPath + '/index.html';
  return _path2.PROJECT_ROOT_PATH + '/' + htmlPath;
}

function getServerTaskOption(args) {
  return {
    cli: 'server',
    serverOption: {
      port: (args === null || args === void 0 ? void 0 : args.port) || 4001,
      host: (args === null || args === void 0 ? void 0 : args.host) || '127.0.0.1',
      htmlPath: getHtmlPath(args === null || args === void 0 ? void 0 : args.htmlPath)
    }
  };
}