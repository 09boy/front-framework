"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = upgradeTask;

var _shelljs = require("shelljs");

var _path = require("../../share/path");

function upgradeTask() {
  return [{
    title: 'Checking local git status',
    task: async () => {
      await new Promise(resolve => {
        (0, _shelljs.cd)(`${_path.SMART_ROOT_PATH}`);
        const branch = (0, _shelljs.exec)('git branch', {
          silent: true
        }).stdout.trim();
        (0, _shelljs.exec)('git status --porcelain', {
          silent: true
        }, (code, stdout) => {
          if (stdout !== '') {
            // throw new Error('Unclean working tree. Commit or stash changes first.');
            (0, _shelljs.exec)('git add .');
            (0, _shelljs.exec)('git commit -m "save by smart cli"');
          }

          if (!branch.includes('master')) {
            (0, _shelljs.exec)('git checkout master');
          }

          resolve();
        });
      });
    }
  }, {
    title: 'Checking remote git history',
    task: async ctx => {
      await new Promise(resolve => {
        (0, _shelljs.cd)(`${_path.SMART_ROOT_PATH}`); // git diff --name-only master origin/master

        (0, _shelljs.exec)('git diff --name-only master origin/master', {
          silent: true
        }, (code, stdout) => {
          // console.log(code, stdout, '=====');
          ctx.isNeedUpdateSmart = !!stdout;
          resolve(); // throw new Error('Remote history differ. Please pull changes.');
        });
      });
    }
  }, {
    // title: 'Upgrading Smart',
    task: async (ctx, task) => {
      await new Promise(resolve => {
        if (ctx.isNeedUpdateSmart) {
          task.title = 'Upgrading Smart';
          (0, _shelljs.cd)(`${_path.SMART_ROOT_PATH}`);
          /*exec('git pull origin master', { silent: true, async: true }).stdout?.on('data', () => {
            task.title = 'Upgrade success';
            resolve();
          })*/

          resolve();
        } else {
          task.title = 'Already the latest version';
          resolve();
        }
        /*cd(`${SMART_ROOT_PATH}`);
        exec('git pull origin master', { silent: true, async: true }).stdout?.on('data', () => {
          task.title = 'Upgrade success';
          resolve();
        });*/

      });
    }
  }];
}

module.exports = exports.default;