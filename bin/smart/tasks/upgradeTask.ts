import { cd, cp, exec, mkdir, touch } from 'shelljs';
import { ListrTask } from "listr2";
import { TaskContext } from "share/logProgress";
import { SMART_ROOT_PATH } from "share/path";

export default function upgradeTask(): ListrTask<TaskContext>[] {
  return [
    {
      title: 'Checking local git status',
      task: async (_, task): Promise<void> => {
        await new Promise<void>(resolve => {
          cd(`${SMART_ROOT_PATH}`);
          const branch = exec('git branch', { silent: true }).stdout.trim();

          exec('git status --porcelain', (code, stdout) => {
            if (stdout !== '') {
              // throw new Error('Unclean working tree. Commit or stash changes first.');
              exec('git add .');
              exec('git commit -m "save by smart cli"');
            }

            if (!branch.includes('master')) {
              exec('git checkout master');
            }
            resolve();
          });
        })
      }
    },
    {
      title: 'Checking remote git history',
      task: async () => {
        await new Promise<void>(resolve => {
          cd(`${SMART_ROOT_PATH}`);
          // const remoteBranch = exec('git branch -r', { silent: true }).stdout;

          // git diff --name-only master origin/master
          exec('git diff --name-only master origin/master ', (code, stdout) => {
            console.log(code, stdout, '=====');
            throw new Error('Remote history differ. Please pull changes.');
            resolve();
          });
        });
        /*const result = exec('git rev-list --count --left-only @{u}...HEAD', { silent: true }).code;
        if (result !== 0) {
          throw new Error('Remote history differ. Please pull changes.');
        }*/
        // console.log('ok');
      }
    },
    {
      title: 'Upgrading Smart',
      task: async (_, task) => {
        await new Promise<void>(resolve => {
          resolve();
          /*cd(`${SMART_ROOT_PATH}`);
          exec('git pull origin master', { silent: true, async: true }).stdout?.on('data', () => {
            task.title = 'Upgrade success';
            resolve();
          });*/
        })
      }
    },
  ];
}