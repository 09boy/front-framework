"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Smart;

var _shelljs = require("shelljs");

var _logProgress = _interopRequireDefault(require("../share/logProgress"));

var _path = require("../share/path");

var _tasks = require("./tasks");

var _webpackMiddleware = require("../@webpack/webpackMiddleware");

var _createComponent = _interopRequireDefault(require("./tasks/create/createComponent"));

var _createPage = _interopRequireDefault(require("./tasks/create/createPage"));

var _init = _interopRequireDefault(require("./tasks/init"));

var _upgradeTask = _interopRequireDefault(require("./tasks/upgradeTask"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function Smart({
  cli,
  projectOption,
  serverOption,
  configOption,
  pages,
  components
}) {
  const tasks = [];

  switch (cli) {
    case 'create':
      {
        if (!projectOption || !configOption) {
          break;
        }

        const {
          structure,
          buildDir
        } = configOption;
        const {
          dirName,
          projectType
        } = projectOption;
        tasks.push({
          title: 'Smart',
          task: async () => {
            await new Promise(resolve => {
              if (!(0, _shelljs.which)('git')) {
                throw new Error('Sorry, this script requires git!');
              }

              resolve();
            });
          }
        }, {
          title: 'Generate the project configuration files',
          task: (ctx, task) => task.newListr((0, _init.default)(projectOption, structure.src, buildDir), {
            concurrent: true,
            rendererOptions: {
              collapse: false,
              showSkipMessage: false
            }
          })
        }
        /*{
          title: 'Create the project directory structure',
          // eslint-disable-next-line @typescript-eslint/require-await
          task: async () => {
            createProjectStructure(projectType, dirName, structure)
          },
        },
        {
          title: 'Write the configuration entry file',
          // eslint-disable-next-line @typescript-eslint/require-await
          task: async () => {
            initFiles(projectOption, structure)
          },
        },
        {
          title: 'Install package dependencies with npm',
          // eslint-disable-next-line @typescript-eslint/require-await
          task: async () => {
            exec('npm install', { silent: true });
          },
        },*/
        );
      }
      break;

    case "start":
    case "server":
      {
        if (!serverOption) {
          break;
        }

        const server = new _tasks.Server(serverOption);

        if (cli === 'start' && projectOption && configOption) {
          (0, _shelljs.rm)('-rf', `${_path.PROJECT_ROOT_PATH}/${configOption.buildDir}/!*`);
          process.env.NODE_ENV = 'development';
          server.addHook((0, _webpackMiddleware.getWebpackMiddleware)({
            projectOption,
            configOption
          }));
        }

        server.start();
      }
      break;

    case "build":
      {
        if (!projectOption || !configOption) {
          break;
        }

        process.env.NODE_ENV = 'production';
        process.env.BuildConfig = JSON.stringify({
          projectOption,
          configOption
        });
        (0, _shelljs.exec)(`${_path.SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${_path.SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
      }
      break;

    case "page":
      {
        if (!pages || !projectOption) {
          break;
        }

        (0, _createPage.default)(projectOption.projectType, pages);
      }
      break;

    case "component":
      {
        if (!components || !projectOption) {
          break;
        }

        (0, _createComponent.default)(projectOption.projectType, components);
      }
      break;

    case "upgrade":
      {
        tasks.push({
          title: 'Start Upgrading',
          task: (ctx, task) => task.newListr((0, _upgradeTask.default)(), {
            concurrent: false,
            rendererOptions: {
              collapse: false
            }
          })
        });
      }
      break;
  }

  if (tasks.length) {
    tasks.push({
      // title: 'Finished',
      task: async (_, task) => {
        await new Promise(resolve => {
          task.title = 'Finished';
          resolve();
        });
      }
    });
    await (0, _logProgress.default)(tasks);
  }
}

module.exports = exports.default;