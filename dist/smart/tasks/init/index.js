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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function intProject(option) {
  const {
    projectType,
    scriptType,
    dirName
  } = option;
  (0, _shelljs.mkdir)(dirName);
  (0, _shelljs.cd)(dirName);

  if (projectType !== 'miniProgram') {
    (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', 'templates/smart-config/index.template.html'), 'index.template.html');
  }

  (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', `templates/smart-config/${projectType}.smart.config.yml`), 'smart.config.yml');
  const isTs = scriptType === 'ts';

  if (isTs) {
    (0, _shelljs.touch)('typings.d.ts');
  } // package


  const packageData = (0, _package.default)(option, 'src');
  (0, _fs.writeFileSync)('package.json', JSON.stringify(packageData, null, 2));
  (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '..eslintrc.js');
  (0, _fs.writeFileSync)('.prettierrc.json', JSON.stringify((0, _getPrettierrc.getPrettierConfigData)(projectType), null, 2));
  (0, _fsHelper.parseJsonFileToJsFile)('.prettierrc');
  (0, _fs.writeFileSync)('jest.config.json', JSON.stringify((0, _jestConfig.getJestConfigData)(projectType), null, 2));
  (0, _fsHelper.parseJsonFileToJsFile)('jest.config');
  (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.jest.setup.js`), '.jest.setup.js'); //.gitignore

  (0, _fs.writeFileSync)('.gitignore', (0, _ignore.getIgnoreData)(projectType).join('\n'));
}

module.exports = exports.default;