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

var _package = require("./package");

var _jestConfig = require("./jestConfig");

var _ignore = require("./ignore");

var _babelResolveConfig = require("./babelResolveConfig");

var _browserslistrc = require("./browserslistrc");

var _path2 = require("../../../share/path");

function parseData(obj, parentPath) {
  const paths = [];
  const keys = Object.keys(obj);
  Object.values(obj).map((s, i) => {
    let cp = `${parentPath}/${keys[i]}`;

    if (typeof s === 'object' && !Array.isArray(s)) {
      if (s.name) {
        cp = `${parentPath}/${s.name}`;
        delete s.name;
        paths.push(cp, ...parseData(s, cp));
      }
    } else if (Array.isArray(s)) {
      paths.push(cp, ...s.map(c => `${cp}/${c}`));
    } else if (s) {
      paths.push(`${parentPath}/${s}`);
    }
  });
  return paths;
}

function getProjectStructurePaths(structure) {
  const {
    src,
    assets
  } = structure;
  const paths = { ...structure
  };
  delete paths.src;
  return [src, '__tests__', ...parseData(paths, src), `${src}/${assets}/images`];
}

async function createProjectStructure(projectName, structure) {
  const paths = getProjectStructurePaths(structure);
  await (0, _shelljs.mkdir)(projectName);
  await (0, _shelljs.cd)(projectName);
  await (0, _shelljs.mkdir)(paths);
}

async function createProjectConfigurationFiles({
  structure,
  projectName,
  projectType,
  projectLanguageType
}) {
  const {
    src,
    assets
  } = structure;
  const packageData = await (0, _package.getPackageData)(projectName, projectType, projectLanguageType, src);
  await (0, _fs.writeFileSync)('package.json', JSON.stringify(packageData, null, 2));
  await (0, _fs.writeFileSync)('.gitignore', (0, _ignore.getIgnoreData)(projectType, ['dist']).join('\n'));
  await (0, _fs.writeFileSync)('.browserslistrc', (0, _browserslistrc.getBrowserslistrcConfigData)(projectType).join('\n'));
  await (0, _fs.writeFileSync)(`${projectLanguageType}config.json`, JSON.stringify((0, _babelResolveConfig.getBabelResolveConfigData)(projectType, projectLanguageType, src), null, 2));
  await (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.eslint.js`), '.eslintrc.js'); // await cp('-f', join(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.babel.config.js`), 'babel.config.js');

  const babelConfigData = await (0, _fs.readFileSync)((0, _path.join)(__dirname, `../../templates/root/${projectType}.${projectLanguageType}.babel.config.js`), 'utf-8');
  await (0, _fs.writeFileSync)('babel.config.js', babelConfigData.replace(/<smart_path>/g, _path2.SMART_ROOT_PATH).replace('<rootPath>', src));
  await (0, _fs.writeFileSync)('jest.config.json', JSON.stringify((0, _jestConfig.getJestConfigData)(projectType, src, projectLanguageType), null, 2));
  await (0, _fsHelper.parseJsonFileToJsFile)('jest.config');
  const imagesPath = `${src}/${assets}/images/`;
  (0, _shelljs.cp)('-f', _path2.SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  (0, _shelljs.cp)('-f', _path2.SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
}