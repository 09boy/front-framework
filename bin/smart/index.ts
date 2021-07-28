import { exec, which, rm } from 'shelljs';
import { RequestHandler } from 'express';
import { ListrTask } from 'listr2';
import runProgressTask, { TaskContext } from 'share/logProgress';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { SmartTaskOption } from 'types/Smart';
import { Server, createProjectStructure, } from './tasks';
import { getWebpackMiddleware } from '@webpack/webpackMiddleware';
import { initFiles } from './tasks/create/initFiles';
import createComponents from './tasks/create/createComponent';
import createPages from './tasks/create/createPage';

import initProjectTasks  from './tasks/init';
import upgradeTask from './tasks/upgradeTask';



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
          ), { concurrent: true, rendererOptions: { collapse: true, showSkipMessage: false } }),
        },
        {
          title: 'Create the project directory structure',
          task: async () => createProjectStructure(projectType, dirName, structure),
        },
        {
          title: 'Write the application entry file',
          task: async () => initFiles(projectOption, structure),
        },
        {
         title: 'Install package dependencies with npm',
         task: async () => {
           await new Promise<void>(resolve => {
             exec('npm install', { silent: true, async: true }).stdout?.on('end', resolve);
           });
         },
        },
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
        task: (ctx, task) => task.newListr(upgradeTask(), { concurrent: false, rendererOptions: { collapse: false } })
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
    // process.exit();
  }
}
