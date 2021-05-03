"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDynamicModule = getDynamicModule;
exports.parseStructure = parseStructure;
exports.getProjectPaths = getProjectPaths;
exports.getComponentDirName = getComponentDirName;
exports.getClassName = getClassName;

var _path = require("./path");

function getDynamicModule(name) {
  return `${_path.SMART_ROOT_PATH}/node_modules/${name.trim()}`;
}

function parseStructure({
  src,
  pages,
  app,
  components,
  assets
}, projectType) {
  src = src || 'src';
  pages = pages || 'pages';
  assets = assets || 'assets';

  if (projectType === 'react' || projectType === 'vue') {
    app = app || 'app';
    components = components || 'components';
  }

  return {
    src,
    pages,
    assets,
    app,
    components
  };
}

function getProjectPaths({
  src,
  pages,
  assets,
  app,
  components
}) {
  const pagesPath = `${src}/${pages}`;
  const componentsPath = components ? `${src}/${components}` : '';
  const appPath = app ? `${src}/${app}` : '';
  const assetsPath = `${src}/${assets}`;
  return {
    src,
    pagesPath,
    componentsPath,
    appPath,
    assetsPath,
    pages,
    app
  };
}

const FILE_Reg = /[.\-_']/g;

function getComponentDirName(name) {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  name = name.replace(/#/g, '-');
  return name;
}

function getClassName(name) {
  name = name.trim().toLocaleLowerCase().replace(FILE_Reg, '#');
  return name.split('#').map(s => s.replace(s.charAt(0), s.charAt(0).toUpperCase())).join('');
}