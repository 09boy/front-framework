import { exec, cd, which, rm } from 'shelljs';
import { RequestHandler } from 'express';
import { SmartOptionType } from 'types/SmartOptionType';
import LogProgressTask from 'share/logProgress';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { isValidProjectName } from 'share/projectHelper';
import { SmartConfigType } from 'types/SmartConfigType';
import { Server,
  ServerOptionType,
  createProjectStructure,
  createProjectConfigurationFiles, } from './tasks';
import { getWebpackMiddleware } from '@webpack/webpackMiddleware';
import { initFiles } from './tasks/create/initFiles';
import createComponents from './tasks/create/createComponent';
import createPages from 'smart/tasks/create/createPage';

export default async function Smart({ cliType, cliArgs }: SmartOptionType, configData?: SmartConfigType) {
  let logTask;

  if (cliType === 'start' || cliType === 'server') {
    const server = new Server(cliArgs as ServerOptionType);
    if (cliType === 'start' && configData) {
      await rm('-rf', PROJECT_ROOT_PATH + '/' + configData.buildDir);
      server.addHook(getWebpackMiddleware('development', configData) as RequestHandler[]);
    }
    server.start();
  } else if (cliType === 'page') {
    if (configData && cliArgs?.pages) {
      await createPages(cliArgs.pages, configData);
    }
  } else if (cliType === 'component') {
    if (configData && cliArgs?.components) {
      await createComponents(cliArgs.components, configData);
    }
  } else if (cliType === 'build') {

    process.env.BuildConfig = JSON.stringify(configData);
    await exec(`${SMART_ROOT_PATH}/node_modules/.bin/webpack --config ${SMART_ROOT_PATH}/dist/@webpack/index.js --color`);
    process.env.BuildConfig = undefined;

  } else if (cliType === 'upgrade') {

    logTask = new LogProgressTask();
    await logTask.add([
      {
        title: 'Git',
        task: (ctx, task) => {
          return task.newListr([
            {
              title: 'Checking git status',
              task: async () => {
                const result = await exec('git status --porcelain', { silent: true });
                if (result !== '') {
                  throw new Error('Unclean working tree. Commit or stash changes first.');
                }

                await exec('git init');
              }
            },
            {
              title: 'Checking remote history',
              task: async () => {
                const result = await exec('git rev-list --count --left-only @{u}...HEAD', { silent: true });
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
  } else if (cliType === 'create' && cliArgs?.createOption) {
    const { structure, projectName, projectType, projectLanguageType } = cliArgs.createOption;

    logTask = new LogProgressTask();
    await logTask.add([
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
        task: async () => {
          if (!isValidProjectName(projectName)) {
            throw new Error(`The '${projectName}' project is already exist.`);
          }
          await createProjectStructure(projectName, structure);
        },
      },
      {
        title: 'Write the configuration entry file',
        task: async () => initFiles({ structure, projectName, projectType, projectLanguageType }),
      },
      {
        title: 'Generate project installation files',
        task: async () =>  createProjectConfigurationFiles({ structure, projectName, projectType, projectLanguageType }),
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
