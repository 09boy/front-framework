"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Smart;

var _shelljs = require("shelljs");

var _logProgress = _interopRequireDefault(require("../share/logProgress"));

var _path = require("../share/path");

var _projectHelper = require("../share/projectHelper");

var _tasks = require("./tasks");

var _webpackMiddleware = require("../@webpack/webpackMiddleware");

var _initFiles = require("./tasks/create/initFiles");

var _createComponent = _interopRequireDefault(require("./tasks/create/createComponent"));

var _createPage = _interopRequireDefault(require("./tasks/create/createPage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function Smart({
  cliType,
  cliArgs
}, configData) {
  let logTask;

  if (cliType === 'start' || cliType === 'server') {
    const server = new _tasks.Server(cliArgs);

    if (cliType === 'start' && configData) {
      await (0, _shelljs.rm)('-rf', _path.PROJECT_ROOT_PATH + '/' + configData.buildDir);
      server.addHook((0, _webpackMiddleware.getWebpackMiddleware)('development', configData));
    }

    server.start();
  } else if (cliType === 'page') {
    if (configData && cliArgs !== null && cliArgs !== void 0 && cliArgs.pages) {
      await (0, _createPage.default)(cliArgs.pages, configData);
    }
  } else if (cliType === 'component') {
    if (configData && cliArgs !== null && cliArgs !== void 0 && cliArgs.components) {
      await (0, _createComponent.default)(cliArgs.components, configData);
    }
  } else if (cliType === 'build') {
    process.env.BuildConfig = JSON.stringify(configData);
    await (0, _shelljs.exec)(`${_path.SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${_path.SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
    process.env.BuildConfig = undefined;
  } else if (cliType === 'upgrade') {
    logTask = new _logProgress.default();
    await logTask.add([{
      title: 'Git',
      task: (ctx, task) => {
        return task.newListr([{
          title: 'Checking git status',
          task: async () => {
            const result = await (0, _shelljs.exec)('git status --porcelain', {
              silent: true
            });

            if (result !== '') {
              throw new Error('Unclean working tree. Commit or stash changes first.');
            }

            await (0, _shelljs.exec)('git init');
          }
        }, {
          title: 'Checking remote history',
          task: async () => {
            const result = await (0, _shelljs.exec)('git rev-list --count --left-only @{u}...HEAD', {
              silent: true
            });

            if (result !== '0') {
              throw new Error('Remote history differ. Please pull changes.');
            }
          }
        }], {
          concurrent: true
        });
      }
    }, {
      title: 'Start Upgrading',
      task: () => {
        (0, _shelljs.cd)(`${_path.SMART_ROOT_PATH}`);
        (0, _shelljs.exec)('git pull origin master', {
          silent: true
        });
      }
    }, {
      title: 'Finished',
      task: () => 'Done'
    }]);
    await logTask.run();
  } else if (cliType === 'create' && cliArgs !== null && cliArgs !== void 0 && cliArgs.createOption) {
    const {
      structure,
      projectName,
      projectType,
      projectLanguageType
    } = cliArgs.createOption;
    logTask = new _logProgress.default();
    await logTask.add([{
      title: 'Smart',
      task: (ctx, task) => {
        return task.newListr([{
          title: 'Check Git',
          task: () => {
            if (!(0, _shelljs.which)('git')) {
              throw new Error('Sorry, this script requires git!');
            }
          }
        }], {
          concurrent: true
        });
      }
    }, {
      title: 'Create the project directory structure',
      task: async () => {
        if (!(0, _projectHelper.isValidProjectName)(projectName)) {
          throw new Error(`The '${projectName}' project is already exist.`);
        }

        await (0, _tasks.createProjectStructure)(projectName, structure);
      }
    }, {
      title: 'Write the configuration entry file',
      task: async () => (0, _initFiles.initFiles)({
        structure,
        projectName,
        projectType,
        projectLanguageType
      })
    }, {
      title: 'Generate project installation files',
      task: async () => (0, _tasks.createProjectConfigurationFiles)({
        structure,
        projectName,
        projectType,
        projectLanguageType
      })
    }, {
      title: 'Install package dependencies with npm',
      task: () => (0, _shelljs.exec)('npm install', {
        silent: true
      })
    }, {
      title: 'Finished',
      task: () => 'Done'
    }]);
    await logTask.run();
  }
}

module.exports = exports.default;