import { cd, exec } from 'shelljs';
import { ListrTask } from "listr2";
import { TaskContext } from "share/logProgress";
import { SMART_ROOT_PATH } from "share/path";

export default function upgradeTask(): ListrTask<TaskContext>[] {
  return [
    {
      title: 'Checking local git status',
      task: async (): Promise<void> => {
        await new Promise<void>(resolve => {
          cd(`${SMART_ROOT_PATH}`);
          const branch = exec('git branch', { silent: true }).stdout.trim();

          exec('git status --porcelain', { silent: true }, (code, stdout) => {
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
      task: async (ctx) => {
        await new Promise<void>(resolve => {
          cd(`${SMART_ROOT_PATH}`);
          // git diff --name-only master origin/master
          exec('git diff --name-only master origin/master', { silent: true }, (code, stdout) => {
            // console.log(code, stdout, '=====');
            ctx.isNeedUpdateSmart = !!stdout;
            resolve();
            // throw new Error('Remote history differ. Please pull changes.');
          });
        });
      }
    },
    {
      // title: 'Upgrading Smart',
      task: async (ctx, task) => {
        await new Promise<void>(resolve => {
          if (ctx.isNeedUpdateSmart) {
            task.title = 'Upgrading Smart';
            cd(`${SMART_ROOT_PATH}`);
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
        })
      }
    },
  ];
}