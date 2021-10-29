"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClassName = getClassName;
exports.getComponentDirName = getComponentDirName;
exports.getCreateNames = getCreateNames;
exports.getDynamicModule = getDynamicModule;
exports.getProjectName = getProjectName;
exports.getProjectStructure = getProjectStructure;
exports.initSmart = initSmart;
exports.isSmartProject = isSmartProject;
exports.isValidProjectName = isValidProjectName;

var _fs = require("fs");

var _path = require("./path");

var _env = require("./env");

function isSmartProject() {
  const hastPackageFile = (0, _fs.existsSync)('package.json');
  const hasSmartConfigFile = (0, _fs.existsSync)('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

function initSmart() {
  const isNewProject = !isSmartProject();
  const smartCli = isNewProject ? _env.createProjectCli : _env.developProjectCli;
  return {
    isNewProject,
    smartCli
  };
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

function getProjectStructure(projectType) {
  switch (projectType) {
    case 'normal':
      return {
        src: 'src',
        pages: 'pages',
        components: 'components',
        assets: {
          images: 'images',
          styles: 'styles'
        }
      };

    case 'react':
    case 'vue':
      return {
        src: 'src',
        pages: 'pages',
        components: 'components',
        assets: {
          images: 'images',
          styles: 'styles'
        },
        app: 'app'
      };

    case 'nodejs':
      return {
        src: 'src',
        pages: 'pages',
        assets: 'assets',
        routes: 'routes',
        server: 'server'
      };

    case 'miniProgram':
      return {
        src: 'src',
        pages: 'pages',
        components: 'components',
        assets: {
          images: 'images',
          styles: 'styles'
        }
      };
  }
}