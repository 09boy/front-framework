"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = intProject;

var _shelljs = require("shelljs");

var _package = _interopRequireDefault(require("./package"));

var _fs = require("fs");

var _ignore = require("./ignore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function intProject(option, src) {
  const {
    projectType,
    modeType,
    scriptType,
    name,
    dirName
  } = option;
  (0, _shelljs.mkdir)(dirName);
  (0, _shelljs.cd)(dirName);
  const isTs = scriptType === 'ts';

  if (isTs) {
    (0, _shelljs.touch)('typings.d.ts');
  } // writeFileSync('.browserslistrc', getBrowserslistrcConfigData(projectType).join('\n'));
  // package


  const packageData = (0, _package.default)(option, 'src');
  (0, _fs.writeFileSync)('package.json', JSON.stringify(packageData, null, 2)); // writeFileSync(`${scriptType}.config.json`, JSON.stringify(getBabelResolveConfigData(projectType, scriptType, src), null, 2));
  // cp('-f', join(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');

  /*
  *  const babelConfigData = readFileSync(join(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
  writeFileSync('babel.config.js', babelConfigData.replace(/<smart_path>/g, SMART_ROOT_PATH).replace('<rootPath>', src));
  * */

  /*
  * writeFileSync('jest.config.json', JSON.stringify(getJestConfigData(projectType), null, 2));
  parseJsonFileToJsFile('jest.config');
  * */

  /*
  *  const imagesPath = `${src}/${assets}/images/`;
  cp('-f', SMART_ROOT_PATH + '/smart.favicon.ico', imagesPath + 'favicon.ico');
  cp('-f', SMART_ROOT_PATH + '/smart.logo.png', imagesPath + 'smart.logo.png');
  * */
  //.gitignore

  (0, _fs.writeFileSync)('.gitignore', (0, _ignore.getIgnoreData)(projectType).join('\n'));
}

module.exports = exports.default;