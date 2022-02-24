"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProjectTask = createProjectTask;

var _util = _interopRequireDefault(require("util"));

var _child_process = require("child_process");

var _promises = require("fs/promises");

var _path = require("path");

var _path2 = require("../../share/path");

var _smartHelper = require("../../share/smartHelper");

var _package = require("./package");

var _editorsLanguageServer = require("./editorsLanguageServer");

var _directoryStructure = require("./directoryStructure");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const exec = _util.default.promisify(_child_process.exec);

async function initSmartConfigFile(path, type, scriptType) {
  const info = await (0, _promises.readFile)((0, _path.resolve)(__dirname, '..', `templates/${type}/smartConfig.yml`), 'utf-8');
  const newInfo = info.split('\n').map(s => {
    if (s.includes('scriptType')) {
      return `scriptType: ${scriptType}`;
    }

    return s;
  });
  await (0, _promises.writeFile)(`${path}/smart.config.yml`, newInfo.join('\n'), 'utf-8');
}

function initializedConfig(pathName, type, scriptType, alias) {
  const rootPath = `${_path2.PROJECT_ROOT_PATH}/${pathName}`;
  const {
    packageData,
    dependencies,
    devDependencies
  } = (0, _package.getPackageData)(type, scriptType);
  const subTask = [{
    title: 'Create html template',
    enabled: type === 'normal' || type === 'react' || type === 'vue',

    async task() {
      await exec(`cp ${(0, _path.resolve)(__dirname, '..', 'templates/index.template.html')} ${rootPath}`);
    }

  }, {
    title: 'Create package.json file',

    async task() {
      packageData.name = pathName.toLocaleLowerCase().replace(/-/g, '-');
      await (0, _promises.writeFile)(`${rootPath}/package.json`, JSON.stringify(packageData, null, 2), 'utf-8');
    }

  }, {
    title: 'Create smart.config.yml file',

    async task() {
      await initSmartConfigFile(rootPath, type, scriptType);
    }

  }, {
    title: 'Create git files',

    async task() {
      // gitignore
      await exec(`cp ${(0, _path.resolve)(__dirname, '..', 'templates/gitignore')} ${rootPath}/.gitignore`);
    }

  }, {
    title: 'Create basic files',

    async task() {
      await (0, _promises.writeFile)(`${rootPath}/${scriptType}config.json`, (0, _editorsLanguageServer.getLSPData)(type, scriptType, alias), 'utf-8');
      await exec(`cp ${(0, _path.resolve)(__dirname, '..', 'templates', 'config.js')} ${rootPath}/Config.${scriptType}`);
      await exec(`cp ${(0, _path.resolve)(__dirname, '..', 'templates', `${type}/${scriptType}.eslint.js`)} ${rootPath}/.eslintrc.js`); // await exec(`cp ${resolve(__dirname, '..', 'templates', `${type}/${scriptType}.babel.config.js`)} ${rootPath}/babel.config.js`);

      if (type === 'react') {
        await exec(`cp ${(0, _path.resolve)(__dirname, '..', 'templates', `${type}/${scriptType}.babel.config.json`)} ${rootPath}/babelConfig.json`);
      }
    }

  }, {
    title: 'Create jest files',

    task(_, task) {
      // jest.config.js jest.setup.js
      task.output = 'jest';
    }

  }, {
    title: 'Create typescript files',
    enabled: scriptType === 'ts',

    async task() {
      await (0, _editorsLanguageServer.createTsTypingFile)(`${rootPath}/typings.d.ts`);
    }

  }];
  return {
    dependencies,
    devDependencies,
    subTask
  };
}

function installDependedPackages(path, args) {
  if (!args || !(args.dependencies && args.devDependencies)) {
    return [];
  }

  const {
    devDependencies,
    dependencies
  } = args;
  const subTasks = [];

  if (dependencies && dependencies.length > 0) {
    subTasks.push({
      title: 'Install dependencies',

      async task() {
        await exec(`cd ${path} && npm install --save ${dependencies.join(' ')}`);
      }

    });
  }

  if (devDependencies && devDependencies.length > 0) {
    subTasks.push({
      title: 'Install devDependencies',

      async task() {
        await exec(`cd ${path} && npm install --save-dev ${devDependencies.join(' ')}`);
      }

    });
  }

  return subTasks;
}
/*
* @name project name
* @type project type
* @sType script type
* */


function createProjectTask(name, type, sType) {
  const rootPath = `${_path2.PROJECT_ROOT_PATH}/${name}`;
  const alias = (0, _smartHelper.getDefaultAliasData)(type);
  return [{
    title: `** ${type.replace(type.charAt(0), type.charAt(0).toUpperCase())} ${sType === 'js' ? 'javascript' : 'typescript'} project **`,

    task(_, task) {
      task.output = `Creating a new ${type} project`;
    }

  }, {
    title: 'Creating Project Directory',

    async task() {
      await (0, _promises.mkdir)(rootPath);
    }

  }, {
    title: 'Creating Configuration Files',

    task(ctx, task) {
      const {
        subTask,
        dependencies,
        devDependencies
      } = initializedConfig(name, type, sType, alias);
      ctx.dependencies = dependencies;
      ctx.devDependencies = devDependencies;
      return task.newListr(subTask, {
        exitOnError: true,
        concurrent: true
      });
    }

  }, {
    title: 'Creating Development Directories',

    async task() {
      await (0, _directoryStructure.createDirectoryStructure)(rootPath, type, sType);
    }

  }, {
    title: 'Installing Dependency Packages',
    enabled: true,

    task(ctx, task) {
      const subTask = installDependedPackages(rootPath, ctx);

      if (subTask.length) {
        return task.newListr(subTask, {
          concurrent: false
        });
      } else {
        return undefined;
      }
    }

  }, {
    async task(ctx, task) {
      // do something
      if (!(type === 'miniProgram' || type === 'nodejs')) {
        const imgPath = `${rootPath}/${alias.root}/assets/images/`;
        await exec(`cp ${_path2.SMART_ROOT_PATH}/smart.favicon.ico ${imgPath}`);
        await exec(`cp ${_path2.SMART_ROOT_PATH}/smart.logo.png ${imgPath}`);
      }

      task.title = 'Done';
    }

  }];
}