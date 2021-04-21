"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSmartProject = isSmartProject;
exports.isValidProjectName = isValidProjectName;
exports.getProjectName = getProjectName;
exports.parseCli = parseCli;

var _fs = require("fs");

var _path = require("./path");

var _ProjectType = require("../types/ProjectType");

function isSmartProject() {
  const hastPackageFile = (0, _fs.existsSync)('package.json');
  const hasSmartConfigFile = (0, _fs.existsSync)('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

function isValidProjectName(name) {
  return !(0, _fs.existsSync)(`${_path.PROJECT_ROOT_PATH}/${name}`);
}

function getProjectName(name) {
  return name.trim().replace(/\s/g, '-');
}

function getScriptingLanguageType(type) {
  if (typeof type === 'string') {
    return type === _ProjectType.ProjectLanguageType.Typescript || type === _ProjectType.ProjectLanguageType.Typescript1 ? _ProjectType.ProjectLanguageType.Typescript : _ProjectType.ProjectLanguageType.Javascript;
  } else if (Array.isArray(type)) {
    return type.includes('ts') ? _ProjectType.ProjectLanguageType.Typescript : _ProjectType.ProjectLanguageType.Javascript;
  }

  return _ProjectType.ProjectLanguageType.Javascript;
}

function parseDirNames(args) {
  let names = [];

  if (typeof args === 'object') {
    if (args.hasOwnProperty('names') && typeof args.names === 'string') {
      names = args.names.split(',');
    } else {
      names = Object.values(args);
    }
  }

  names = names.filter(s => s.trim() !== '');
  return [...new Set(names)];
}

function parseCli(data, smartConfig) {
  const {
    cliName,
    args
  } = data;
  const cliArr = cliName.split('-');
  const cliType = cliArr[0];
  const projectType = cliArr[1] || (smartConfig === null || smartConfig === void 0 ? void 0 : smartConfig.projectType) || 'normal';
  const port = (args === null || args === void 0 ? void 0 : args.port) || (smartConfig === null || smartConfig === void 0 ? void 0 : smartConfig.port);
  const host = (args === null || args === void 0 ? void 0 : args.host) || (smartConfig === null || smartConfig === void 0 ? void 0 : smartConfig.host);
  const htmlPath = (args === null || args === void 0 ? void 0 : args.htmlPath) || `${smartConfig === null || smartConfig === void 0 ? void 0 : smartConfig.buildDir}/index.html`;
  const result = {
    cliType
  };

  switch (cliType) {
    case 'start':
    case 'server':
      result.cliArgs = {
        port,
        host,
        htmlPath: `${_path.PROJECT_ROOT_PATH}/${htmlPath}`
      };
      break;

    case 'page':
      result.cliArgs = {
        pages: parseDirNames(args)
      };
      break;

    case 'component':
      result.cliArgs = {
        components: parseDirNames(args)
      };
      break;

    case 'build':
      result.cliArgs = args;
      break;

    case 'upgrade':
      break;

    case 'create':
    default:
      const createOption = {
        projectType: projectType,
        projectName: getProjectName(args === null || args === void 0 ? void 0 : args.projectName.trim()),
        projectLanguageType: getScriptingLanguageType(args === null || args === void 0 ? void 0 : args.languageType),
        structure: smartConfig.structure
      };
      result.cliArgs = {
        createOption
      };
      break;
  }

  return result;
}