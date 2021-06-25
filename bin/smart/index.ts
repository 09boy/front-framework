import { exec, cd, which, rm } from 'shelljs';
import { RequestHandler } from 'express';
import LogProgressTask from 'share/logProgress';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { SmartTaskOption } from 'types/Smart';
import { Server, createProjectStructure, } from './tasks';
import { getWebpackMiddleware } from '@webpack/webpackMiddleware';
import { initFiles } from './tasks/create/initFiles';
import createComponents from './tasks/create/createComponent';
import createPages from './tasks/create/createPage';

import intProject from './tasks/init';
import { ListrTask } from "listr2";

export default async function Smart({ cli, projectOption, serverOption, configOption, pages, components } : SmartTaskOption): Promise<void> {
  const tasks: ListrTask[] = [];

  switch (cli) {
    case 'init':
    case 'create':
    {
      if (!projectOption) {
        return;
      }

      const { dirName,  projectType } = projectOption;
      tasks.push(
        {
          title: `Smart Init ${projectType} Project`,
          task: () => intProject(projectOption),
        }
      );

      if (cli !== 'create' || !configOption) {
        return;
      }

      tasks.pop();

      tasks.push(
        {
          title: 'Smart',
          task: (ctx, task) => {
            return task.newListr([
              {
                title: 'Check Git',
                task: () => {
                  if (!which('git')) {
                    throw new Error('Sorry, this script requires git!');
                  }
                }
              },
            ], { concurrent: true });
          },
        },
        {
          title: 'Generate the project configuration files',
          task: () => intProject(projectOption, configOption.structure.src),
        },
        {
          title: 'Create the project directory structure',
          task: () => {
            createProjectStructure(projectType, dirName, configOption.structure);
          },
        },
        {
          title: 'Write the configuration entry file',
          task: () => initFiles(projectOption, configOption.structure),
        },
        {
          title: 'Install package dependencies with npm',
          task: () => exec('npm install', { silent: true }),
        },
      );
    }
    break;
    case "start":
    case "server":
    {
      if (!serverOption) {
        return;
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
        return;
      }
      process.env.NODE_ENV = 'production';
      process.env.BuildConfig = JSON.stringify({ projectOption, configOption });
      exec(`${SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
    }
    break;
    case "page":
    {
      if (!pages || !projectOption) {
        return;
      }
      createPages(projectOption.projectType, pages);
    }
    break;
    case "component":
    {
      if (!components || !projectOption) {
        return;
      }
      createComponents(projectOption.projectType, components);
    }
    break;
    case "upgrade":
    {
      tasks.push(
        {
          title: 'Git',
          task: (ctx, task) => {
            return task.newListr([
              {
                title: 'Checking git status',
                task: () => {
                  const result = exec('git status --porcelain', { silent: true });
                  if (result !== '') {
                    throw new Error('Unclean working tree. Commit or stash changes first.');
                  }

                  exec('git init');
                }
              },
              {
                title: 'Checking remote history',
                task: () => {
                  const result = exec('git rev-list --count --left-only @{u}...HEAD', { silent: true });
                  if (result !== '0') {
                    throw new Error('Remote history differ. Please pull changes.');
                  }
                }
              }
            ], { concurrent: true });
          }
        },
        {
          title: 'Start Upgrading',
          task: () => {
            cd(`${SMART_ROOT_PATH}`);
            exec('git pull origin master', { silent: true });
          }
        },
      );
    }
    break;
  }

  if (tasks.length) {
    tasks.push({
      title: 'Finished',
      task: () => 'done',
    });

    const logTask = new LogProgressTask();
    logTask.add(tasks);
    await logTask.run();
    process.exit(0);
  }
}
