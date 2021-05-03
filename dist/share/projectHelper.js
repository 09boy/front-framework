"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSmartProject = isSmartProject;
exports.isValidProjectName = isValidProjectName;
exports.getProjectName = getProjectName;
exports.getComponentDirName = getComponentDirName;
exports.getClassName = getClassName;
exports.getScriptType = getScriptType;
exports.getCreateNames = getCreateNames;
exports.getDynamicModule = getDynamicModule;
exports.getProjectStructurePath = getProjectStructurePath;

var _fs = require("fs");

var _path = require("./path");

function isSmartProject() {
  const hastPackageFile = (0, _fs.existsSync)('package.json');
  const hasSmartConfigFile = (0, _fs.existsSync)('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

function isValidProjectName(name) {
  return !(0, _fs.existsSync)(`${_path.PROJECT_ROOT_PATH}/${name}`);
}

function getProjectName(name) {
  return name.trim().replace(/\s/g, '-').toLocaleLowerCase();
}

const FILE_Reg = /[.\-_ ']/g;

function getComponentDirName(name) {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  name = name.replace(/#/g, '-');
  return name;
}

function getClassName(name) {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  return name.split('#').map(s => s.replace(s.charAt(0), s.charAt(0).toUpperCase())).join('');
} // default javascript


function getScriptType(type) {
  if (type === 'ts') {
    return 'ts';
  }

  return 'js';
} // for creating new pages or new components


function getCreateNames(option) {
  let names;

  if (typeof option === 'string') {
    names = option.split(',');
  } else if (Array.isArray(option)) {
    names = option;
  } else {
    names = Object.values(option);
  }

  names = names.filter(s => s.trim() !== '').map(s => s.trim());
  return [...new Set(names)];
}

function getDynamicModule(name) {
  return `${_path.SMART_ROOT_PATH}/node_modules/${name.trim()}`;
}

function getProjectStructurePath({
  src,
  app,
  assets,
  components,
  pages
}) {
  const appPath = `${src}/${app || 'app'}`;
  const assetsPath = `${src}/${assets}`;
  const pagesPath = `${src}/${pages}`;
  const componentsPath = `${src}/${components || 'components'}`;
  return {
    appPath,
    assetsPath,
    pagesPath,
    componentsPath
  };
}