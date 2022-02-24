import util from 'util';
import { exec as _exec } from 'child_process';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import { ListrTask } from 'listr2';
import { PROJECT_ROOT_PATH, SMART_ROOT_PATH } from 'share/path';
import { getDefaultAliasData } from 'share/smartHelper';
import { getPackageData } from './package';
import { createTsTypingFile, getLSPData } from './editorsLanguageServer';
import { createDirectoryStructure } from './directoryStructure';
import { ProjectType, ScriptType } from 'types/SmartType';
import { Ctx } from './index';

const exec = util.promisify(_exec);


async function initSmartConfigFile(path: string, type: ProjectType, scriptType: ScriptType) {
  const info = await readFile(resolve(__dirname, '..', `templates/${type}/smartConfig.yml`), 'utf-8');
  const newInfo = info.split('\n').map(s => {
    if (s.includes('scriptType')) {
      return `scriptType: ${scriptType}`;
    }
    return s;
  });
  await writeFile(`${path}/smart.config.yml`, newInfo.join('\n'), 'utf-8');
}

function initializedConfig(pathName: string, type: ProjectType, scriptType: ScriptType, alias: Record<string, string>): {
  dependencies: string[];
  devDependencies: string[];
  subTask: ListrTask[];
} {
  const rootPath = `${PROJECT_ROOT_PATH}/${pathName}`;
  const { packageData, dependencies, devDependencies } = getPackageData(type, scriptType);

  const subTask: ListrTask[] = [
    {
      title: 'Create html template',
      enabled: type === 'normal' || type === 'react' || type === 'vue',
      async task() {
        await exec(`cp ${resolve(__dirname, '..', 'templates/index.template.html')} ${rootPath}`);
      }
    },
    {
      title: 'Create package.json file',
      async task() {
        packageData.name = pathName.toLocaleLowerCase().replace(/-/g, '-');
        await writeFile(`${rootPath}/package.json`, JSON.stringify(packageData, null, 2), 'utf-8');
      }
    },
    {
      title: 'Create smart.config.yml file',
      async task() {
        await initSmartConfigFile(rootPath, type, scriptType);
      }
    },
    {
      title: 'Create git files',
      async task() {
        // gitignore
        await exec(`cp ${resolve(__dirname, '..', 'templates/gitignore')} ${rootPath}/.gitignore`);
      }
    },
    {
      title: 'Create basic files',
      async task() {
        await writeFile(`${rootPath}/${scriptType}config.json`, getLSPData(type, scriptType, alias), 'utf-8');
        await exec(`cp ${resolve(__dirname, '..', 'templates', 'config.js')} ${rootPath}/Config.${scriptType}`);
        await exec(`cp ${resolve(__dirname, '..', 'templates', `${type}/${scriptType}.eslint.js`)} ${rootPath}/.eslintrc.js`);
        // await exec(`cp ${resolve(__dirname, '..', 'templates', `${type}/${scriptType}.babel.config.js`)} ${rootPath}/babel.config.js`);
        if (type === 'react') {
          await exec(`cp ${resolve(__dirname, '..', 'templates', `${type}/${scriptType}.babel.config.json`)} ${rootPath}/babelConfig.json`);
        }
      }
    },
    {
      title: 'Create jest files',
      task(_, task) {
        // jest.config.js jest.setup.js
        task.output = 'jest';
      }
    },
    {
      title: 'Create typescript files',
      enabled: scriptType === 'ts',
      async task() {
        await createTsTypingFile(`${rootPath}/typings.d.ts`);
      }
    }
  ];

  return {
    dependencies,
    devDependencies,
    subTask
  };
}

function installDependedPackages(path: string, args: Ctx): ListrTask[] {
  if (!args || !(args.dependencies && args.devDependencies)) {
    return [];
  }

  const { devDependencies, dependencies } = args;
  const subTasks = [];

  if (dependencies && dependencies.length > 0) {
    subTasks.push({
      title: 'Install dependencies',
      async task() {
        await exec(`cd ${path} && npm install --save ${dependencies.join(' ')}`);
      }
    })
  }

  if (devDependencies && devDependencies.length > 0) {
    subTasks.push({
      title: 'Install devDependencies',
      async task() {
        await exec(`cd ${path} && npm install --save-dev ${devDependencies.join(' ')}`);
      }
    });
  }
  return subTasks;
}

/*
* @name project name
* @type project type
* @sType script type
* */
export function createProjectTask(name: string, type: ProjectType, sType: ScriptType): ListrTask[] {
  const rootPath = `${PROJECT_ROOT_PATH}/${name}`;
  const alias = getDefaultAliasData(type);

  return [
    {
      title: `** ${type.replace(type.charAt(0), type.charAt(0).toUpperCase())} ${sType === 'js' ? 'javascript' : 'typescript'} project **`,
      task(_, task) {
        task.output = `Creating a new ${type} project`;
      }
    },
    {
      title: 'Creating Project Directory',
      async task() {
        await mkdir(rootPath);
      }
    },
    {
      title: 'Creating Configuration Files',
      task(ctx: Ctx, task) {
        const { subTask, dependencies, devDependencies } = initializedConfig(name, type, sType, alias);
        ctx.dependencies = dependencies;
        ctx.devDependencies = devDependencies;
        return task.newListr(subTask, { exitOnError: true, concurrent: true } );
      }
    },
    {
      title: 'Creating Development Directories',
      async task() {
        await createDirectoryStructure(rootPath, type, sType);
      }
    },
    {
      title: 'Installing Dependency Packages',
      enabled: true,
      task(ctx, task) {
        const subTask = installDependedPackages(rootPath, ctx);
        if (subTask.length) {
          return task.newListr(subTask, { concurrent: false });
        } else {
          return undefined;
        }
      }
    },
    {
      async task(ctx, task) {
        // do something
        if (!(type === 'miniProgram' || type === 'nodejs')) {
          const imgPath = `${rootPath}/${alias.root}/assets/images/`;
          await exec(`cp ${SMART_ROOT_PATH}/smart.favicon.ico ${imgPath}`);
          await exec(`cp ${SMART_ROOT_PATH}/smart.logo.png ${imgPath}`);
        }
        task.title = 'Done';
      }
    }
  ];
}