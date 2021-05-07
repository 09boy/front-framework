import { exec, cd, which, rm } from 'shelljs';
import { RequestHandler } from 'express';
import LogProgressTask from 'share/logProgress';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { isValidProjectName } from 'share/projectHelper';
import { SmartTaskOption } from 'types/Smart';
import { Server, createProjectStructure, createProjectConfigurationFiles, } from './tasks';
import { getWebpackMiddleware } from '@webpack/webpackMiddleware';
import { initFiles } from './tasks/create/initFiles';
import createComponents from './tasks/create/createComponent';
import createPages from './tasks/create/createPage';

import intProject from './tasks/init';

export default async function Smart({ cli, projectOption, serverOption, configOption, pages, components } : SmartTaskOption): Promise<void> {
  let logTask;
  if (projectOption && configOption) {
    intProject(projectOption, configOption?.structure.src);
  }

  if (serverOption && (cli === 'start' || cli === 'server')) {
    const server = new Server(serverOption);
    if (cli === 'start' && projectOption && configOption) {
      rm('-rf', `${PROJECT_ROOT_PATH}/${configOption.buildDir}/*`);
      process.env.NODE_ENV = 'development';
      server.addHook(getWebpackMiddleware({ projectOption, configOption }) as RequestHandler[]);
    }
    server.start();
  } else if (cli === 'page' && pages && projectOption) {
    createPages(projectOption.projectType, pages);
  } else if (cli === 'component' && components && projectOption) {
    createComponents(projectOption.projectType, components);
  } else if (cli === 'build' && projectOption && configOption) {
    process.env.NODE_ENV = 'production';
    process.env.BuildConfig = JSON.stringify({ projectOption, configOption });
    exec(`${SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
    process.env.BuildConfig = undefined;
    process.env.NODE_ENV = 'development';
  } else if (cli === 'upgrade') {
    logTask = new LogProgressTask();
    logTask.add([
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
      {
        title: 'Finished',
        task: () => 'Done',
      }
    ]);
    await logTask.run();
  } else if (cli === 'create' && projectOption && configOption) {
    const { dirName,  projectType } = projectOption;

    logTask = new LogProgressTask();
    logTask.add([
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
        title: 'Create the project directory structure',
        task: () => {
          if (!isValidProjectName(dirName)) {
            throw new Error(`The '${dirName}' project is already exist.`);
          }
          createProjectStructure(projectType, dirName, configOption.structure);
        },
      },
      {
        title: 'Write the configuration entry file',
        task: () => initFiles(projectOption, configOption.structure),
      },
      {
        title: 'Generate project installation files',
        task: () => createProjectConfigurationFiles(projectOption, configOption),
      },
      {
        title: 'Install package dependencies with npm',
        task: () => exec('npm install', { silent: true }),
      },
      {
        title: 'Finished',
        task: () => 'Done',
      }
    ]);
    await logTask.run();
  }
}
