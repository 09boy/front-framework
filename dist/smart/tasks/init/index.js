"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initProjectTasks;

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

function initProjectTasks(option, src, buildDir) {
  const {
    projectType,
    scriptType,
    dirName
  } = option;
  const isTs = scriptType === 'ts';
  return [{
    title: `Create ${dirName} directory.`,
    task: async ctx => {
      await new Promise(resolve => {
        (0, _shelljs.mkdir)(dirName);
        (0, _shelljs.cd)(dirName);

        if (isTs) {
          (0, _shelljs.touch)('typings.d.ts');
        }

        ctx.isCreateHtmlTemplate = projectType !== 'miniProgram' && projectType !== 'nodejs';
        resolve();
      });
    }
  }, {
    title: 'Write the smart.config.yml file.',
    task: async () => {
      await new Promise(resolve => {
        (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', `templates/smart-config/${projectType}.smart.config.yml`), 'smart.config.yml');
        resolve();
      });
    }
  }, {
    title: 'Create the package.json file.',
    task: async () => {
      const packageData = await (0, _package.default)(option, src, buildDir);
      await _fs.promises.writeFile('package.json', JSON.stringify(packageData, null, 2));
    }
  }, {
    title: 'Create the eslint files.',
    task: async () => {
      await _fs.promises.writeFile('.gitignore', (0, _ignore.getIgnoreData)(projectType).join('\n'));
      await new Promise(resolve => {
        (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.eslint.js`), '.eslintrc.js');
        resolve();
      });
    }
  }, {
    title: 'Create the prettier file.',
    task: async () => {
      await _fs.promises.writeFile('.prettierrc.json', JSON.stringify((0, _getPrettierrc.getPrettierConfigData)(projectType), null, 2));
      await (0, _fsHelper.parseJsonFileToJsFile)('.prettierrc');
    }
  }, {
    title: 'Create the babel files.',
    task: async () => {
      await _fs.promises.writeFile(`${scriptType}config.json`, JSON.stringify((0, _babelResolveConfig.getBabelResolveConfigData)(projectType, scriptType, src), null, 2));
      const babelConfigData = await _fs.promises.readFile((0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.babel.config.js`), 'utf-8');
      await _fs.promises.writeFile('babel.config.js', babelConfigData.replace(/<smart_path>/g, _path2.SMART_ROOT_PATH).replace('<rootPath>', src));
    }
  }, {
    title: 'Create the html.template file.',
    skip: ctx => !ctx.isCreateHtmlTemplate,
    task: async () => {
      (0, _shelljs.cp)((0, _path.join)(__dirname, '..', '..', 'templates/smart-config/index.template.html'), 'index.template.html');
      await _fs.promises.writeFile('.browserslistrc', (0, _browserslistrc.getBrowserslistrcConfigData)(projectType).join('\n'));
    }
  }, {
    title: 'Create the jest files.',
    task: async () => {
      await _fs.promises.writeFile('jest.config.json', JSON.stringify((0, _jestConfig.getJestConfigData)(projectType), null, 2));
      await (0, _fsHelper.parseJsonFileToJsFile)('jest.config');
      (0, _shelljs.cp)('-f', (0, _path.join)(__dirname, `../../templates/root/${projectType}.${scriptType}.jest.setup.js`), '.jest.setup.js');
    }
  }];
}

module.exports = exports.default;