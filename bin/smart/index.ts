import { exec, cd, which, rm } from 'shelljs';
import { RequestHandler } from 'express';
import runProgressTask, { TaskContext } from "share/logProgress";
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { SmartTaskOption } from 'types/Smart';
import { Server, createProjectStructure, } from './tasks';
import { getWebpackMiddleware } from '@webpack/webpackMiddleware';
import { initFiles } from './tasks/create/initFiles';
import createComponents from './tasks/create/createComponent';
import createPages from './tasks/create/createPage';

import { initProjectTasks } from './tasks/init';
import { Listr, ListrTask } from "listr2";
import { resolve } from "url";


export default async function Smart({ cli, projectOption, serverOption, configOption, pages, components } : SmartTaskOption): Promise<void> {
  const tasks: ListrTask<TaskContext>[] = [];

  switch (cli) {
    case 'create':
    {
      if (!projectOption || !configOption) {
        break;
      }
      const { structure, buildDir } = configOption;
      const { dirName,  projectType } = projectOption;

      tasks.push(
        {
          title: 'Smart',
          task: async (): Promise<void> =>
          {
            await new Promise<void>(resolve => {
              if (!which('git')) {
                throw new Error('Sorry, this script requires git!');
              }
              resolve();
            });
          },
        },
        {
          title: 'Generate the project configuration files',
          task: (ctx, task) => task.newListr(initProjectTasks(
            projectOption, structure.src, buildDir
          ), { concurrent: true, rendererOptions: { collapse: false, showSkipMessage: false } }),
        },
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
      const server = new Server(serverOption);
      if (cli === 'start' && projectOption && configOption) {
        rm('-rf', `${PROJECT_ROOT_PATH}/${configOption.buildDir}/!*`);
        process.env.NODE_ENV = 'development';
        server.addHook(getWebpackMiddleware({ projectOption, configOption }) as RequestHandler[]);
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
      process.env.BuildConfig = JSON.stringify({ projectOption, configOption });
      exec(`${SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
    }
    break;
    case "page":
    {
      if (!pages || !projectOption) {
        break;
      }
      createPages(projectOption.projectType, pages);
    }
    break;
    case "component":
    {
      if (!components || !projectOption) {
        break;
      }
      createComponents(projectOption.projectType, components);
    }
    break;
    case "upgrade":
    {
      tasks.push(
        {
          title: 'Start Upgrading',
          task: (ctx, task) => task.newListr([
              {
                title: 'Checking git status',
                task: async (_, task): Promise<void> => {
                  await new Promise<void>(resolve => {
                    cd(`${SMART_ROOT_PATH}`);
                    exec('git status --porcelain', (code, stdout) => {
                      if (stdout !== '') {
                        // throw new Error('Unclean working tree. Commit or stash changes first.');
                        exec('git add .');
                        exec('git commit -m "save by smart cli"');
                      }
                      task.title = `${code}`;
                      resolve();
                    });
                  })
                 /* if (result !== '') {
                    throw new Error('Unclean working tree. Commit or stash changes first.');
                  }*/

                  // exec('git init');
                }
              },
              // {
              //   title: 'Checking remote history',
              //   // eslint-disable-next-line @typescript-eslint/require-await
              //   task: async () => {
              //     /*const result = exec('git rev-list --count --left-only @{u}...HEAD', { silent: true }).code;
              //     if (result !== 0) {
              //       throw new Error('Remote history differ. Please pull changes.');
              //     }*/
              //     console.log('ok');
              //   }
              // }
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
          ], { concurrent: false, rendererOptions: { collapse: false }, exitOnError: false })
        }
      );
    }
    break;
  }

  if (tasks.length) {
    tasks.push({
      // title: 'Finished',
      task: async (_, task) => {
        await new Promise<void>(resolve => {
          task.title = 'Finished';
          resolve();
        })
      }
    });
    await runProgressTask(tasks);
  }
}
