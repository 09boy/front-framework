"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smartTaskRun = smartTaskRun;

var _path = require("../../share/path");

var _listr = require("listr2");

var _project = require("./project");

var _server = require("./server");

var _actions = require("./actions");

async function parseCommandResult({
  commandName,
  option
}) {
  switch (commandName) {
    case 'create':
      {
        const {
          projectType = 'normal',
          projectName = '',
          scriptType = 'js'
        } = option || {};
        const reg = /[?*.(\s+]/g;
        const name = reg.test(projectName) ? projectName.replace(reg, '-') : projectName;
        return (0, _project.createProjectTask)(name, projectType, scriptType);
      }

    case 'start':
      {
        process.env.__MODE__ = 'start';
        process.env.NODE_ENV = 'development';
        await (0, _server.startDevServe)(option);
      }
      break;

    case 'build':
      {
        process.env.__MODE__ = option ? option.buildModeType || 'test' : 'start';
        process.env.NODE_ENV = 'production';
        await (0, _actions.build)();
      }
      break;

    case 'server':
      (0, _server.startServer)(3003, _path.PROJECT_ROOT_PATH + '/dist');
      break;

    case 'upgrade':
      (0, _actions.upgrade)();
      break;
  }

  return [];
}

const ctx = {
  dependencies: undefined,
  devDependencies: undefined
};

async function smartTaskRun(result) {
  const taskList = await parseCommandResult(result);

  if (result.commandName === 'create') {
    const tasks = new _listr.Listr(taskList, {
      exitOnError: true,
      concurrent: false,
      ctx
    });

    try {
      await tasks.run();
    } catch (e) {
      console.log(e, '=== custom');
    }
  }
}