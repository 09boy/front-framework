"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultDirStructure = void 0;
exports.getConfigData = getConfigData;
exports.getDefaultAliasData = getDefaultAliasData;
exports.getDynamicModule = getDynamicModule;
exports.isDevMode = isDevMode;
exports.isSmartProject = isSmartProject;

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = require("fs");

var _path = require("./path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultDirStructure = {
  normal: {
    root: 'src',
    pages: 'pages',
    assets: ['assets', 'images']
  },
  react: {
    root: 'src',
    pages: ['pages', 'home', 'about'],
    components: 'components',
    assets: ['assets', 'images']
  },
  vue: {
    root: 'src',
    pages: 'pages',
    components: 'components',
    assets: ['assets', 'images']
  },
  nodejs: {},
  miniProgram: {}
};
exports.defaultDirStructure = defaultDirStructure;

function isSmartProject() {
  if (_path.PROJECT_ROOT_PATH === _path.SMART_ROOT_PATH) {
    throw Error('do not use "smart-cli" in framework dir');
  }

  const hastPackageFile = (0, _fs.existsSync)('package.json');
  const hasSmartConfigFile = (0, _fs.existsSync)('smart.config.yml');
  return hastPackageFile && hasSmartConfigFile;
}

function getDynamicModule(name) {
  return `${_path.SMART_ROOT_PATH}/node_modules/${name.trim()}`;
}

async function getConfigData(mergeData = {}) {
  const data = await _jsYaml.default.load((0, _fs.readFileSync)(`${_path.PROJECT_ROOT_PATH}/smart.config.yml`, 'utf8'));
  return { ...data,
    ...mergeData
  };
}

function isDevMode() {
  return process.env.NODE_ENV === 'development';
}

function getDefaultAliasData(type) {
  const dirStructure = defaultDirStructure[type];

  if (Object.keys(dirStructure).length > 0) {
    const alias = {};

    for (const key in dirStructure) {
      if (Object.hasOwnProperty.call(dirStructure, key)) {
        const value = dirStructure[key];

        if (typeof value === 'string') {
          alias[key] = value;
        } else {
          alias[key] = value[0];
        }
      }
    }

    return alias;
  } else {
    return {};
  }
}
/*
export function updateAliasData(type: ProjectType, alias?: Record<string,string>): void | Record<string, string> {
  const data = getDefaultAliasData(type);

  if (alias) {
    const defaultKeys = Object.keys(data);
    const newKeys = Object.keys(alias);
    if (defaultKeys.length !== newKeys.length) {
      return alias;
    }

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key) && Object.hasOwnProperty.call(alias, key)) {
        if (data[key] !== alias[key]) {
          return alias;
        }
      } else {
        return alias;
      }
    }
  }

  return data;
}*/