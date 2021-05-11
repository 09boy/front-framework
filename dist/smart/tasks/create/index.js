"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProjectStructure = createProjectStructure;
exports.createProjectConfigurationFiles = createProjectConfigurationFiles;

var _shelljs = require("shelljs");

var _path = require("path");

var _fs = require("fs");

var _fsHelper = require("../../../share/fsHelper");

var _jestConfig = require("../init/jestConfig");

var _babelResolveConfig = require("../init/babelResolveConfig");

var _browserslistrc = require("./browserslistrc");

var _path2 = require("../../../share/path");

function parseData(obj, parentPath) {
  const paths = [];
  const keys = Object.keys(obj);
  Object.values(obj).map((s, i) => {
    let cp = `${parentPath}/${keys[i]}`;

    if (typeof s === 'object' && !Array.isArray(s)) {
      if (Object.hasOwnProperty.call(s, 'name')) {
        cp = `${parentPath}/${s.name}`;
        delete s.name;
        paths.push(cp, ...parseData(s, cp));
      }
    } else if (Array.isArray(s)) {
      paths.push(cp, ...s.map(c => `${cp}/${c}`));
    } else if (typeof s === 'string') {
      paths.push(`${parentPath}/${s}`);
    }
  });
  return paths;
}

function createProjectStructure(projectType, projectName, structure) {
  const copyStructure = { ...structure
  };
  delete copyStructure.src;
  const paths = [structure.src, '__test__', ...parseData(copyStructure, structure.src), `${structure.src}/${structure.assets}/images`];
  (0, _shelljs.mkdir)(projectName);
  (0, _shelljs.cd)(projectName);
  (0, _shelljs.mkdir)(paths);
}

function createProjectConfigurationFiles(projectOption, {
  structure
}) {
  const {
    projectType,
    scriptType
  } = projectOption;
  const {
    src,
    assets
  } = structure;
  (0, _fs.writeFileSync)('.browserslistrc', (0, _browserslistrc.getBrowserslistrcConfigData)(projectType).join('\n'));
  (0, _fs.writeFileSync)(`${scriptType}config.json`, JSON.stringify((0, _babelResolveConfig.getBabelResolveConfigData)(projectType, scriptType, src), null, 2));
  (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js'); // await cp('-f', join(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.babel.config.js`), 'babel.config.js');

  const babelConfigData = (0, _fs.readFileSync)((0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
  (0, _fs.writeFileSync)('babel.config.js', babelConfigData.replace(/<smart_path>/g, _path2.SMART_ROOT_PATH).replace('<rootPath>', src));
  (0, _fs.writeFileSync)('jest.config.json', JSON.stringify((0, _jestConfig.getJestConfigData)(projectType), null, 2));
  (0, _fsHelper.parseJsonFileToJsFile)('jest.config');
  const imagesPath = `${src}/${assets}/images/`;
  (0, _shelljs.cp)('-f', _path2.SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  (0, _shelljs.cp)('-f', _path2.SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
}