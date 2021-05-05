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
  cli,
  projectOption,
  serverOption,
  configOption,
  pages,
  components
}) {
  let logTask;

  if (serverOption && (cli === 'start' || cli === 'server')) {
    const server = new _tasks.Server(serverOption);

    if (cli === 'start' && projectOption && configOption) {
      (0, _shelljs.rm)('-rf', `${_path.PROJECT_ROOT_PATH}/${configOption.buildDir}/*`);
      process.env.NODE_ENV = 'development';
      server.addHook((0, _webpackMiddleware.getWebpackMiddleware)({
        projectOption,
        configOption
      }));
    }

    server.start();
  } else if (cli === 'page' && pages && projectOption) {
    (0, _createPage.default)(projectOption.projectType, pages);
  } else if (cli === 'component' && components && projectOption) {
    (0, _createComponent.default)(projectOption.projectType, components);
  } else if (cli === 'build' && projectOption && configOption) {
    process.env.NODE_ENV = 'production';
    process.env.BuildConfig = JSON.stringify({
      projectOption,
      configOption
    });
    (0, _shelljs.exec)(`${_path.SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${_path.SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
    process.env.BuildConfig = undefined;
    process.env.NODE_ENV = 'development';
  } else if (cli === 'upgrade') {
    logTask = new _logProgress.default();
    logTask.add([{
      title: 'Git',
      task: (ctx, task) => {
        return task.newListr([{
          title: 'Checking git status',
          task: () => {
            const result = (0, _shelljs.exec)('git status --porcelain', {
              silent: true
            });

            if (result !== '') {
              throw new Error('Unclean working tree. Commit or stash changes first.');
            }

            (0, _shelljs.exec)('git init');
          }
        }, {
          title: 'Checking remote history',
          task: () => {
            const result = (0, _shelljs.exec)('git rev-list --count --left-only @{u}...HEAD', {
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
  } else if (cli === 'create' && projectOption && configOption) {
    const {
      dirName,
      projectType
    } = projectOption;
    logTask = new _logProgress.default();
    logTask.add([{
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
      task: () => {
        if (!(0, _projectHelper.isValidProjectName)(dirName)) {
          throw new Error(`The '${dirName}' project is already exist.`);
        }

        (0, _tasks.createProjectStructure)(projectType, dirName, configOption.structure);
      }
    }, {
      title: 'Write the configuration entry file',
      task: () => (0, _initFiles.initFiles)(projectOption, configOption.structure)
    }, {
      title: 'Generate project installation files',
      task: () => (0, _tasks.createProjectConfigurationFiles)(projectOption, configOption)
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