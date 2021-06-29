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
    task: async (_, task) => {
      await new Promise(resolve => {
        (0, _shelljs.cd)(`${_path.SMART_ROOT_PATH}`);
        const branch = (0, _shelljs.exec)('git branch', {
          silent: true
        }).stdout.trim();
        (0, _shelljs.exec)('git status --porcelain', (code, stdout) => {
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
    task: async () => {
      await new Promise(resolve => {
        (0, _shelljs.cd)(`${_path.SMART_ROOT_PATH}`); // const remoteBranch = exec('git branch -r', { silent: true }).stdout;
        // git diff --name-only master origin/master

        (0, _shelljs.exec)('git diff --name-only master origin/master ', (code, stdout) => {
          console.log(code, stdout, '=====');

          if (stdout) {
            resolve();
          }

          throw new Error('Remote history differ. Please pull changes.');
        });
      });
      /*const result = exec('git rev-list --count --left-only @{u}...HEAD', { silent: true }).code;
      if (result !== 0) {
        throw new Error('Remote history differ. Please pull changes.');
      }*/
      // console.log('ok');
    }
  }, {
    title: 'Upgrading Smart',
    task: async (_, task) => {
      await new Promise(resolve => {
        resolve();
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