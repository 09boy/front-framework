"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = intProject;

var _shelljs = require("shelljs");

var _package = _interopRequireDefault(require("./package"));

var _fs = require("fs");

var _ignore = require("./ignore");

var _jestConfig = require("./jestConfig");

var _getPrettierrc = require("./getPrettierrc");

var _path = require("path");

var _fsHelper = require("../../../share/fsHelper");

var _browserslistrc = require("../create/browserslistrc");

var _babelResolveConfig = require("./babelResolveConfig");

var _path2 = require("../../../share/path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function intProject(option, src = 'src') {
  const {
    projectType,
    scriptType,
    dirName
  } = option;
  (0, _shelljs.mkdir)(dirName);
  (0, _shelljs.cd)(dirName);
  const isTs = scriptType === 'ts';

  if (isTs) {
    (0, _shelljs.touch)('typings.d.ts');
  }

  (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', `templates/smart-config/${projectType}.smart.config.yml`), 'smart.config.yml'); // package

  const packageData = (0, _package.default)(option, src);
  (0, _fs.writeFileSync)('package.json', JSON.stringify(packageData, null, 2)); //.gitignore

  (0, _fs.writeFileSync)('.gitignore', (0, _ignore.getIgnoreData)(projectType).join('\n')); // eslintrc

  (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js'); // babel

  const babelConfigData = (0, _fs.readFileSync)((0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
  (0, _fs.writeFileSync)('babel.config.js', babelConfigData.replace(/<smart_path>/g, _path2.SMART_ROOT_PATH).replace('<rootPath>', src)); // resolve

  (0, _fs.writeFileSync)(`${scriptType}config.json`, JSON.stringify((0, _babelResolveConfig.getBabelResolveConfigData)(projectType, scriptType, src), null, 2)); // jest

  (0, _fs.writeFileSync)('jest.config.json', JSON.stringify((0, _jestConfig.getJestConfigData)(projectType), null, 2));
  (0, _fsHelper.parseJsonFileToJsFile)('jest.config');
  (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.jest.setup.js`), '.jest.setup.js'); // prettierrc

  (0, _fs.writeFileSync)('.prettierrc.json', JSON.stringify((0, _getPrettierrc.getPrettierConfigData)(projectType), null, 2));
  (0, _fsHelper.parseJsonFileToJsFile)('.prettierrc');

  if (projectType !== 'miniProgram' && projectType !== 'nodejs') {
    (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', 'templates/smart-config/index.template.html'), 'index.template.html');
    (0, _fs.writeFileSync)('.browserslistrc', (0, _browserslistrc.getBrowserslistrcConfigData)(projectType).join('\n'));
  }
}

module.exports = exports.default;